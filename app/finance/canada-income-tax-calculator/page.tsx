import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import CanadaTaxClient from './CanadaTaxClient';

export const metadata: Metadata = {
  title: 'Canada Income Tax Calculator (2025 CRA — Ontario, BC & Alberta) | SolveItCalculator',
  description:
    'Calculate 2025 Canadian federal and provincial income tax for Ontario, British Columbia, and Alberta. Includes RRSP deductions, Basic Personal Amount credits, CPP1 ($71,300 YMPE), CPP2 ($81,200 YAMPE), and EI.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/canada-income-tax-calculator',
  },
  openGraph: {
    title: 'Canada Income Tax Calculator (2025 CRA — Ontario, BC & Alberta) | SolveItCalculator',
    description: 'Calculate 2025 Canadian federal and provincial income tax for Ontario, British Columbia, and Alberta. Includes RRSP deductions, Basic Personal Amount credits, CPP1 ($71,300 YMPE), CPP2 ($81,200 YAMPE), and EI.',
    url: 'https://solveitcalculator.com/finance/canada-income-tax-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Canada Income Tax Calculator (2025 CRA — Ontario, BC & Alberta) | SolveItCalculator',
    description: 'Calculate 2025 Canadian federal and provincial income tax for Ontario, British Columbia, and Alberta. Includes RRSP deductions, Basic Personal Amount credits, CPP1 ($71,300 YMPE), CPP2 ($81,200 YAMPE), and EI.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'canada-income-tax-calculator',
  slug: 'canada-income-tax-calculator',
  name: 'Canada Income Tax Calculator',
  h1: 'Canada Income Tax & CPP/EI Paycheck Calculator (2025 CRA)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance',
  canonicalUrl: 'https://solveitcalculator.com/finance/canada-income-tax-calculator',
  shortAnswer:
    'Calculate your 2025 Canadian net take-home pay, combined marginal and average tax rates, RRSP tax savings, and mandatory CPP, second-tier CPP2, and Employment Insurance (EI) contributions across Ontario, British Columbia, and Alberta.',
  formula: {
    equation: 'Net = Gross − RRSP − Tax_{Federal} − Tax_{Provincial} − CPP_1 − CPP_2 − EI',
    description:
      'Applies CRA 2025 federal brackets (with CA$16,129 Basic Personal Amount credit), provincial brackets (including Ontario Surtax & Ontario Health Premium where applicable), CPP Tier 1 (5.95% up to CA$71,300), CPP Tier 2 (4% from CA$71,300 to CA$81,200), and EI (1.64% up to CA$65,700).',
    variables: [
      { symbol: 'CPP_1', name: 'Base + First Additional CPP', unit: '5.95% up to CA$71,300', description: 'Applies above CA$3,500 basic exemption; maximum CA$4,034.10 in 2025.' },
      { symbol: 'CPP_2', name: 'Second Additional CPP (CPP2)', unit: '4.0% (CA$71,300–CA$81,200)', description: 'Second earnings ceiling (YAMPE); maximum CA$396.00 in 2025.' },
      { symbol: 'EI', name: 'Employment Insurance', unit: '1.64% up to CA$65,700', description: 'Maximum annual employee premium of CA$1,077.48 in 2025.' },
    ],
    assumptions: [
      'Enhanced CPP (1% of CPP1) and 100% of CPP2 are deducted from taxable income, while base CPP (4.95%) and EI generate non-refundable tax credits at the lowest bracket rate.',
    ],
  },
  workedExample: {
    title: 'CA$95,000 Income in Ontario with CA$5,000 RRSP Contribution',
    scenario: 'An Ontario resident earning CA$95,000 in 2025 who contributes CA$5,000 to an RRSP.',
    inputs: {
      'Gross Income': 'CA$95,000',
      'Province': 'Ontario (ON)',
      'RRSP Deduction': 'CA$5,000',
    },
    stepByStep: [
      'CPP1 (maxed at CA$71,300) = CA$4,034.10; CPP2 (maxed at CA$81,200) = CA$396.00; Total CPP = CA$4,430.10.',
      'EI Premium (maxed at CA$65,700) = CA$1,077.48.',
      'Taxable Income after CA$5,000 RRSP and enhanced CPP deduction = CA$88,926.',
      'Federal Tax = ~CA$11,945; Ontario Provincial Tax (incl. Ontario Health Premium) = ~CA$6,435.',
      'Net Take-Home Pay = CA$66,112/year (CA$5,509/month).',
    ],
    finalResult: 'CA$66,112/year Net | 31.48% Combined Marginal Rate',
    interpretation: 'The CA$5,000 RRSP contribution reduced combined federal and Ontario tax by approximately CA$1,574.',
  },
  howToUse: [
    'Select your province (Ontario, British Columbia, or Alberta).',
    'Enter your annual gross income and any planned RRSP contribution.',
    'Review your federal tax, provincial tax, CPP1/CPP2, and EI breakdown.',
  ],
  howItIsCalculated: [
    'Computes CPP1 (5.95% up to CA$71,300 YMPE), CPP2 (4% up to CA$81,200 YAMPE), and EI (1.64% up to CA$65,700).',
    'Applies 2025 Federal and Provincial progressive tax brackets and Basic Personal Amount credits.',
  ],
  whenToUse: [
    'When estimating Canadian take-home pay or calculating the tax refund generated by an RRSP contribution.',
  ],
  limitations: [
    'Quebec residents file a separate provincial T1/TP-1 return with QPP and QPIP rates.',
  ],
  sourceReference: {
    organization: 'Canada Revenue Agency (CRA)',
    standardName: 'T4032 Payroll Deductions Formulas (January 2025)',
    citation: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['salary-to-hourly-calculator', 'savings-goal-calculator', 'us-state-take-home-calculator'],
  relatedConversionPaths: [
    { label: 'Salary to Hourly Calculator', path: '/finance/salary-to-hourly-calculator' },
    { label: 'Savings Goal Calculator', path: '/compound-interest-calculator' },
    { label: 'US State Take-Home Calculator', path: '/finance/us-state-take-home-calculator' },
  ],
  relatedGuidePaths: [
    { title: 'UK PAYE Tax Calculator', path: '/finance/uk-paye-calculator' },
  ],
  faqs: [
    {
      question: 'What is CPP2 in Canada for 2025?',
      answer:
        'Starting in 2024 and expanding in 2025, the Canada Pension Plan introduced a second earnings ceiling (YAMPE). In 2025, employees pay regular CPP (5.95%) on earnings between CA$3,500 and CA$71,300 (YMPE), and an additional 4.0% CPP2 contribution on earnings between CA$71,300 and CA$81,200 (up to CA$396 maximum).',
    },
  ],
};

export default function CanadaTaxPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA} currencySymbol="CA$">
      <CanadaTaxClient />
    </CalculatorPageSystem>
  );
}
