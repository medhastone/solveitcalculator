import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import SelfEmploymentTaxClient from './SelfEmploymentTaxClient';

export const metadata: Metadata = {
  title: 'Self-Employment Tax Calculator (2025 IRS Schedule SE & 1040-ES) | SolveItCalculator',
  description:
    'Calculate 2025 US Self-Employment Tax (15.3% Social Security & Medicare on 92.35% of net profit), the 50% above-the-line SE tax deduction, W-2 wage base coordination ($176,100 cap), and quarterly 1040-ES estimated payment dates.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/self-employment-tax-calculator',
  },
  openGraph: {
    title: 'Self-Employment Tax Calculator (2025 IRS Schedule SE & 1040-ES) | SolveItCalculator',
    description:
      'Calculate 2025 US Self-Employment Tax (15.3% Social Security & Medicare on 92.35% of net profit), the 50% above-the-line SE tax deduction, W-2 wage base coordination ($176,100 cap), and quarterly 1040-ES estimated payment dates.',
    url: 'https://solveitcalculator.com/finance/self-employment-tax-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Self-Employment Tax Calculator (2025 IRS Schedule SE & 1040-ES) | SolveItCalculator',
    description:
      'Calculate 2025 US Self-Employment Tax (15.3% Social Security & Medicare on 92.35% of net profit), the 50% above-the-line SE tax deduction, W-2 wage base coordination ($176,100 cap), and quarterly 1040-ES estimated payment dates.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'self-employment-tax-calculator',
  slug: 'self-employment-tax-calculator',
  name: 'Self-Employment Tax Calculator',
  h1: 'US Self-Employment Tax & Quarterly 1040-ES Calculator (2025)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance',
  canonicalUrl: 'https://solveitcalculator.com/finance/self-employment-tax-calculator',
  shortAnswer:
    'Calculate your 2025 IRS Schedule SE self-employment tax (12.4% Social Security + 2.9% Medicare on 92.35% of net business profit), your 50% above-the-line tax deduction, W-2 Social Security cap coordination, and quarterly Form 1040-ES estimated tax payments.',
  formula: {
    equation:
      'SE_{Earnings} = 0.9235 × Profit ; SE_{Tax} = 0.124 × min(SE_{Earnings}, $176,100 − W2) + 0.029 × SE_{Earnings} + Med_{Add}',
    description:
      'Under IRC § 1401 and IRS Schedule SE, self-employed sole proprietors and 1099 independent contractors multiply net Schedule C profit by 92.35% before applying 12.4% Social Security (capped at $176,100 combined with W-2 wages) and 2.9% Medicare.',
    variables: [
      { symbol: '0.9235', name: 'Net Earnings Multiplier', unit: '92.35%', description: 'Statutory deduction of the 7.65% employer-equivalent FICA share before computing SE tax.' },
      { symbol: 'SS_Cap', name: '2025 Social Security Wage Base', unit: '$176,100', description: 'Maximum combined W-2 + SE earnings subject to the 12.4% OASDI tax in 2025.' },
      { symbol: 'Ded_SE', name: 'Deductible Half of SE Tax', unit: '50% of regular SE tax', description: 'Above-the-line adjustment to income on Form 1040 Schedule 1 Line 15.' },
    ],
    assumptions: [
      'Self-employment tax applies when net earnings from self-employment reach $400 or more.',
      'The 0.9% Additional Medicare Tax applies above $200,000 (Single) or $250,000 (Married Filing Jointly) and is not eligible for the 50% above-the-line deduction.',
    ],
  },
  workedExample: {
    title: '$95,000 Net Freelance Profit (Single, No W-2 Wages)',
    scenario: 'A single 1099 consultant with $95,000 in Schedule C net profit and $0 W-2 wages in 2025.',
    inputs: {
      'Net Business Profit': '$95,000',
      'Filing Status': 'Single',
      'Other W-2 Wages': '$0',
    },
    stepByStep: [
      'Taxable Net Earnings from SE = $95,000 × 92.35% = $87,732.50.',
      'Social Security Tax (12.4% on $87,732.50) = $10,878.83.',
      'Medicare Tax (2.9% on $87,732.50) = $2,544.24.',
      'Total Self-Employment Tax = $10,878.83 + $2,544.24 = $13,423.07 (14.13% effective rate on profit).',
      'Deductible Half of SE Tax = $13,423.07 × 50% = $6,711.54 (reduces AGI to $88,288.46).',
    ],
    finalResult: '$13,423 Total SE Tax | $6,712 Above-the-Line Deduction | $6,018 Quarterly 1040-ES',
    interpretation: 'Because of the 92.35% multiplier, the effective self-employment tax rate below the Social Security cap is 14.13% of net profit rather than the nominal 15.3%.',
  },
  howToUse: [
    'Enter your expected annual net business profit (gross 1099 revenue minus deductible business expenses).',
    'Select your tax filing status.',
    'If you also hold a W-2 job, enter your W-2 gross wages so the engine automatically reduces your remaining $176,100 Social Security cap.',
    'Review your quarterly Form 1040-ES payment schedule and IRS safe-harbor rules.',
  ],
  howItIsCalculated: [
    'Multiplies net Schedule C profit by 92.35% per IRS Schedule SE Part I Line 4a.',
    'Applies 12.4% Social Security tax up to the remaining $176,100 wage base after subtracting W-2 wages.',
    'Applies 2.9% Medicare tax on all net SE earnings plus 0.9% Additional Medicare Tax above threshold.',
    'Subtracts 50% of regular SE tax from gross income to determine incremental federal income tax and quarterly payments.',
  ],
  whenToUse: [
    'When setting aside money from 1099 freelance, consulting, or gig-economy checks for quarterly IRS payments.',
    'When earning side-hustle 1099 income alongside a full-time W-2 salary.',
  ],
  limitations: [
    'State income taxes and local business gross-receipts taxes are not included in federal Form 1040-ES.',
  ],
  sourceReference: {
    organization: 'Internal Revenue Service (IRS) & Social Security Administration',
    standardName: 'Form 1040 Schedule SE & Form 1040-ES (2025)',
    citation: 'IRC § 1401, § 164(f); IRS Publication 334 & Form 1040-ES',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['us-federal-income-tax-calculator', 'us-state-take-home-calculator'],
  relatedConversionPaths: [
    { label: '1099 vs W-2 Calculator', path: '/finance/1099-vs-w2-calculator' },
    { label: 'Freelance Hourly Rate Calculator', path: '/finance/salary-to-hourly-calculator' },
    { label: 'US Federal Income Tax Calculator', path: '/finance/us-federal-income-tax-calculator' },
  ],
  relatedGuidePaths: [
    { title: 'US State Take-Home Paycheck Calculator', path: '/finance/us-state-take-home-calculator' },
  ],
  faqs: [
    {
      question: 'Why do I multiply my net profit by 92.35% before calculating self-employment tax?',
      answer:
        'W-2 employees do not pay FICA tax on the 7.65% FICA contribution paid by their employer. To put self-employed individuals on equal footing, the IRS reduces net business profit by 7.65% (leaving 92.35%) before applying the 15.3% self-employment tax rate.',
    },
    {
      question: 'How do my W-2 wages affect my self-employment tax?',
      answer:
        'The $176,100 Social Security wage base for 2025 applies to your combined W-2 and self-employment earnings. If your W-2 salary is already $176,100 or higher, you pay 0% Social Security tax on your self-employment profit and only owe the 2.9% (plus any 0.9% additional) Medicare portion.',
    },
  ],
};

export default function SelfEmploymentTaxPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <SelfEmploymentTaxClient />
    </CalculatorPageSystem>
  );
}
