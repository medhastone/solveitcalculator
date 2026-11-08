import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import W2Vs1099Client from './W2Vs1099Client';

export const metadata: Metadata = {
  title: '1099 vs W-2 Calculator (2025 Break-Even Hourly & Annual Solver) | SolveItCalculator',
  description:
    'Compare 1099 contractor income vs W-2 salary side-by-side. Computes Self-Employment tax, QBI 20% deduction, employer health and 401(k) match value, and solves for the exact break-even 1099 hourly rate.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/1099-vs-w2-calculator',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: '1099-vs-w2-calculator',
  slug: '1099-vs-w2-calculator',
  name: '1099 vs W-2 Calculator',
  h1: '1099 Contractor vs W-2 Employee Calculator (Break-Even Rate Solver)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance/taxes',
  canonicalUrl: 'https://solveitcalculator.com/finance/1099-vs-w2-calculator',
  shortAnswer:
    'Compare a W-2 employee salary and benefits package against a 1099 independent contractor rate. Uses a 50-iteration numerical bisection solver to compute the exact 1099 gross revenue and hourly rate required to match your W-2 after-tax total compensation.',
  formula: {
    equation: 'Net_{W2} + Benefits_{Health + Match} = Gross_{1099} − Expenses − Health_{1099} − SE_{Tax} − FedTax_{1099}',
    description:
      'Solves for the exact 1099 gross compensation where net cash after Schedule C expenses, self-employed health insurance, Schedule SE taxes (15.3% on 92.35% profit), and Section 199A QBI-adjusted Federal Income Tax equals total W-2 net cash plus employer benefits.',
    variables: [
      { symbol: 'Gross_1099', name: 'Break-Even 1099 Gross Revenue', unit: 'USD ($/year)', description: 'Annual 1099 billings required to match W-2 net pay plus benefits.' },
      { symbol: 'SE_Tax', name: 'Self-Employment Tax', unit: 'USD ($/year)', description: '12.4% Social Security (up to $176,100) + 2.9% Medicare on 92.35% of net profit.' },
      { symbol: 'QBI', name: 'Qualified Business Income Deduction', unit: '20% of Net', description: 'Section 199A deduction reducing federal taxable income for eligible 1099 contractors.' },
    ],
    assumptions: [
      'Both scenarios use the verified 2025 IRS federal tax brackets and $176,100 Social Security wage base.',
      'The break-even solver dynamically recomputes taxes at every iteration rather than using a static multiplier.',
    ],
  },
  workedExample: {
    title: '$100,000 W-2 Salary ($6,500 Health + 4% Match) vs $75/hr 1099 Contractor',
    scenario: 'A single filer comparing a $100,000 W-2 job with $6,500 employer health coverage and 4% ($4,000) 401(k) match against $75/hr for 1,840 billable hours ($138,000 gross) with $6,000 expenses and $7,200 health insurance.',
    inputs: {
      'W-2 Salary & Benefits': '$100,000 Salary + $6,500 Health + $4,000 401(k) Match',
      '1099 Gross Revenue': '$75/hr × 1,840 hrs = $138,000',
      '1099 Expenses & Health': '$6,000 Expenses + $7,200 Health Insurance',
    },
    stepByStep: [
      'W-2 Net Cash = $100,000 − $13,614 Fed Tax − $7,650 FICA = $78,736; plus $10,500 benefits = $89,236 Total W-2 Package.',
      '1099 Net Profit = $138,000 − $6,000 = $132,000; SE Tax = $18,653; Fed Tax (with 50% SE deduction, health deduction & 20% QBI) = $13,075.',
      '1099 Net Cash After Expenses, Health & Taxes = $93,072 ($3,836 ahead of the W-2 package).',
      'Exact Break-Even 1099 Gross solved via bisection = $131,845/yr ($71.65/hr across 1,840 billable hours).',
    ],
    finalResult: '$131,845/year ($71.65/hr) Exact Break-Even 1099 Rate',
    interpretation: 'Because a 1099 contractor pays the employer half of FICA, funds their own health insurance, and absorbs unbilled PTO days, $71.65/hr is required just to tie a $100,000 ($48.08/hr nominal) W-2 salary.',
  },
  howToUse: [
    'Enter your W-2 base salary, employer health subsidy, 401(k) match percentage, and paid vacation/holiday days.',
    'Enter your proposed 1099 hourly rate and billable hours (or annual contract gross), business expenses, and health insurance premium.',
    'Check the Break-Even Solver card to see the exact 1099 annual and hourly rate computed for your numbers.',
  ],
  howItIsCalculated: [
    'Evaluates W-2 net cash using the #30 Federal Tax and FICA engines plus employer-paid benefits.',
    'Evaluates 1099 net cash using the #32 Schedule SE engine, above-the-line deductions, and Section 199A QBI.',
    'Runs a 50-step binary search (bisection) to pinpoint the exact 1099 gross revenue that equates both net packages.',
  ],
  whenToUse: [
    'When converting from a W-2 employee to an independent 1099 contractor for the same client or employer.',
    'When quoting hourly contract rates to staffing agencies.',
  ],
  limitations: [
    'State-level unemployment insurance, workers compensation, and city business taxes vary by locality.',
  ],
  sourceReference: {
    organization: 'Internal Revenue Service (IRS)',
    standardName: 'IRC § 1, § 162, § 199A & Schedule SE (2025)',
    citation: 'IRS Rev. Proc. 2024-40 & Publication 334',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['self-employment-tax-calculator', 'us-state-take-home-calculator', 'salary-to-hourly-calculator'],
  relatedConversionPaths: [
    { label: 'Self-Employment Tax Calculator', path: '/finance/self-employment-tax-calculator' },
    { label: 'Freelance Hourly Rate Calculator', path: '/freelance-hourly-rate-calculator' },
    { label: 'Take-Home Pay Calculator', path: '/finance/take-home-pay-calculator' },
  ],
  relatedGuidePaths: [
    { title: 'Salary to Hourly Calculator', path: '/finance/salary-to-hourly-calculator' },
  ],
  faqs: [
    {
      question: 'Why do 1099 contractors need to charge 25% to 40% more per hour than W-2 employees?',
      answer:
        'A 1099 contractor must pay the employer share of Social Security and Medicare (+7.65%), purchase individual health insurance, fund their own retirement without an employer 401(k) match, cover software/equipment expenses, and absorb unpaid vacation, holidays, and sick days.',
    },
  ],
};

export default function W2Vs1099Page() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <W2Vs1099Client />
    </CalculatorPageSystem>
  );
}
