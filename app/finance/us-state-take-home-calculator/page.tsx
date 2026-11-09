import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import UsStateTakeHomeClient from './UsStateTakeHomeClient';

export const metadata: Metadata = {
  title: 'US State Take-Home Paycheck Calculator (2025) — CA, NY, TX, FL, WA & All States | SolveItCalculator',
  description:
    'Calculate your exact US net take-home paycheck by state. Includes 2025 IRS federal income tax brackets, FICA Social Security ($176,100 cap), Medicare, state income tax, and state payroll items (CA SDI 1.2%, NY PFL, WA Cares).',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/us-state-take-home-calculator',
  },
  openGraph: {
    title: 'US State Take-Home Paycheck Calculator (2025) — CA, NY, TX, FL, WA & All States | SolveItCalculator',
    description:
      'Calculate your exact US net take-home paycheck by state. Includes 2025 IRS federal income tax brackets, FICA Social Security ($176,100 cap), Medicare, state income tax, and state payroll items (CA SDI 1.2%, NY PFL, WA Cares).',
    url: 'https://solveitcalculator.com/finance/us-state-take-home-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US State Take-Home Paycheck Calculator (2025) — CA, NY, TX, FL, WA & All States | SolveItCalculator',
    description:
      'Calculate your exact US net take-home paycheck by state. Includes 2025 IRS federal income tax brackets, FICA Social Security ($176,100 cap), Medicare, state income tax, and state payroll items (CA SDI 1.2%, NY PFL, WA Cares).',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'us-state-take-home-calculator',
  slug: 'us-state-take-home-calculator',
  name: 'US State Take-Home Calculator',
  h1: 'US State Take-Home Paycheck Calculator (2025)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance',
  canonicalUrl: 'https://solveitcalculator.com/finance/us-state-take-home-calculator',
  shortAnswer:
    'Calculate your net take-home pay per year, month, bi-weekly paycheck, and hour across California, New York, Texas, Florida, Washington, and US states using verified 2025 IRS, FICA, and state payroll schedules.',
  formula: {
    equation: 'Net Pay = Gross − PreTax_{401k,HSA} − Tax_{Federal} − FICA_{SS+Med} − Tax_{State} − Payroll_{SDI/PFML}',
    description:
      'Combines the IRS Section 1 progressive federal tax engine with FICA payroll taxes (6.2% Social Security up to $176,100; 1.45% Medicare + 0.9% Additional Medicare above $200k/$250k), state progressive or flat brackets, and mandatory state employee payroll deductions.',
    variables: [
      { symbol: 'Gross', name: 'Annual Gross Compensation', unit: 'USD ($)', description: 'Total pre-tax annual salary or wages.' },
      { symbol: 'FICA_SS', name: 'Social Security Tax', unit: '6.2% up to $176,100', description: 'OASDI employee tax capped at $10,918.20 for 2025.' },
      { symbol: 'FICA_Med', name: 'Medicare & Additional Medicare', unit: '1.45% + 0.9%', description: 'Uncapped 1.45% Hospital Insurance plus 0.9% above $200k Single / $250k MFJ.' },
      { symbol: 'Payroll_State', name: 'State Mandatory Payroll Items', unit: 'USD ($)', description: 'Includes CA SDI (1.2% uncapped in 2025), NY PFL/SDI, WA Cares (0.58%), NJ SUI/SDI/FLI.' },
    ],
    assumptions: [
      'Traditional 401(k) contributions reduce Federal and State taxable income, but remain subject to FICA taxes.',
      'Section 125 Health Insurance and HSA payroll deductions are exempt from Federal, State, and FICA taxes.',
    ],
  },
  workedExample: {
    title: '$115,000 Salary in California (Single, $6,900 401k, $2,400 HSA)',
    scenario: 'A single employee in California earning $115,000/yr paid bi-weekly, contributing 6% ($6,900) to a pre-tax 401(k) and $2,400 to an HSA.',
    inputs: {
      'Gross Salary': '$115,000',
      'State': 'California (CA)',
      'Pre-Tax Deductions': '$9,300 ($6,900 401k + $2,400 HSA)',
      'Pay Frequency': 'Bi-Weekly (26 paychecks)',
    },
    stepByStep: [
      'Federal AGI = $115,000 − $9,300 = $105,700; less $15,000 standard deduction = $90,700 taxable income -> $14,914 Federal Tax.',
      'FICA Base = $115,000 − $2,400 HSA = $112,600 -> Social Security (6.2%) = $6,981.20 + Medicare (1.45%) = $1,632.70 -> $8,613.90 FICA.',
      'California Taxable Income = $105,700 − $5,540 CA Standard Deduction = $100,160 -> ~$5,863 CA Income Tax + $1,351 CA SDI (1.2%).',
      'Annual Net Take-Home Pay = $115,000 − $9,300 − $14,914 − $8,614 − $7,214 = $74,958 ($2,883/bi-weekly).',
    ],
    finalResult: '$74,958/year Net ($2,883.00 Bi-Weekly Paycheck)',
    interpretation: 'Moving the same $115,000 salary to Texas or Florida (0% state income tax) increases annual take-home pay by $7,214/year ($277.46 per bi-weekly paycheck).',
  },
  howToUse: [
    'Click one of the top priority states (CA, NY, TX, FL, WA) or choose your state from the full verified state selector.',
    'Enter your gross annual salary and select your paycheck frequency (bi-weekly, semi-monthly, monthly, weekly).',
    'Enter any pre-tax 401(k) and HSA/medical deductions to see how they lower your federal and state tax withholding.',
    'Inspect the stacked paycheck bar and compare your take-home pay across top states at the bottom of the results panel.',
  ],
  howItIsCalculated: [
    'Federal income tax is computed using the verified 2025 IRS Rev. Proc. 2024-40 brackets and standard deductions.',
    'FICA taxes apply 6.2% Social Security up to the $176,100 SSA wage base and 1.45% Medicare (+0.9% Additional Medicare above statutory MAGI thresholds).',
    'State income tax and mandatory state payroll items (CA SDI 1.2%, NY PFL, WA Cares, NJ FLI/SDI) are applied per each state revenue department schedule.',
  ],
  whenToUse: [
    'When evaluating a job offer or relocation between states with high income tax (CA, NY) and states with zero income tax (TX, FL, WA).',
    'To audit your bi-weekly or semi-monthly paycheck stub and see how increasing your 401(k) deferral impacts net cash in hand.',
  ],
  limitations: [
    'City-specific local income taxes (such as NYC resident tax or Philadelphia wage tax) and post-tax Roth deductions are not automatically subtracted.',
  ],
  sourceReference: {
    organization: 'IRS, Social Security Administration (SSA) & State Revenue Agencies (CA FTB/EDD, NY DTF, WA ESD)',
    standardName: '2025 US Federal & State Payroll Withholding Schedules',
    citation: 'IRS Publication 15-T (2025); SSA 2025 Contribution Base ($176,100); CA EDD 2025 SDI Rate (1.2%)',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['us-federal-income-tax-calculator', '401k-calculator', 'salary-to-hourly-calculator'],
  relatedConversionPaths: [
    { label: 'US Federal Income Tax Calculator', path: '/finance/us-federal-income-tax-calculator' },
    { label: '401(k) Retirement Calculator', path: '/finance/401k-calculator' },
    { label: 'Salary to Hourly Calculator', path: '/finance/salary-to-hourly-calculator' },
  ],
  relatedGuidePaths: [
    { title: '1099 vs W-2 Compensation Comparison', path: '/finance/1099-vs-w2-calculator' },
    { title: 'Bonus Tax Withholding Calculator', path: '/finance/bonus-tax-calculator' },
  ],
  faqs: [
    {
      question: 'Why does California deduct 1.2% for SDI on my entire salary in 2025?',
      answer:
        'Following California Senate Bill 951, the California State Disability Insurance (SDI) taxable wage ceiling was repealed starting in 2024. For 2025, the CA EDD set the SDI withholding rate at 1.2% on all employee wages with no upper cap.',
    },
    {
      question: 'Which US states have zero state income tax?',
      answer:
        'Nine states levy no general state income tax on earned wages: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. However, Washington levies a 0.58% WA Cares Fund payroll tax on W-2 wages.',
    },
  ],
};

export default function UsStateTakeHomePage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <UsStateTakeHomeClient />
    </CalculatorPageSystem>
  );
}
