import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import IndiaIncomeTaxClient from './IndiaIncomeTaxClient';

export const metadata: Metadata = {
  title: 'India Income Tax Calculator (FY 2025-26 & 2024-25 New vs Old Regime) | SolveItCalculator',
  description:
    'Compare India Income Tax under New Regime (Section 115BAC with ₹75,000 standard deduction and ₹12L Section 87A rebate) vs Old Regime (80C, 80D, HRA, 24b). Computes exact deductions required for Old Regime to win.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/india-income-tax-calculator',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'india-income-tax-calculator',
  slug: 'india-income-tax-calculator',
  name: 'India Income Tax Calculator (New vs Old Regime)',
  h1: 'India Income Tax Calculator — New vs Old Regime (FY 2025–26 & FY 2024–25)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance/taxes',
  canonicalUrl: 'https://solveitcalculator.com/finance/india-income-tax-calculator',
  shortAnswer:
    'Compare your Indian income tax liability side-by-side under the Section 115BAC New Tax Regime and the Old Tax Regime for FY 2025–26 (AY 2026–27) and FY 2024–25. Includes Section 87A rebate, marginal relief, 4% Health & Education Cess, and solves for the exact deduction amount needed for the Old Regime to break even.',
  formula: {
    equation: 'Tax = 1.04 × max(0, SlabTax(Gross − Deductions) − Rebate_{87A})',
    description:
      'Evaluates progressive slab tax under both regimes, applies the ₹75,000 (New) or ₹50,000 (Old) standard deduction, checks Section 87A zero-tax eligibility (up to ₹12,00,000 taxable income in FY 2025–26 New Regime; ₹5,00,000 Old Regime), and adds 4% Health & Education Cess.',
    variables: [
      { symbol: 'StdDed', name: 'Salaried Standard Deduction', unit: '₹75,000 (New) / ₹50,000 (Old)', description: 'Section 16(ia) flat deduction from salary income.' },
      { symbol: 'Rebate_87A', name: 'Section 87A Tax Rebate', unit: 'Up to ₹60,000 (FY 25-26 New)', description: 'Reduces tax to zero if New Regime taxable income does not exceed ₹12,00,000 (₹12.75L gross salary).' },
      { symbol: 'Cess', name: 'Health & Education Cess', unit: '4% of Income Tax', description: 'Mandatory 4% cess added to base tax after rebate.' },
    ],
    assumptions: [
      'Marginal relief is automatically applied when taxable income slightly exceeds the Section 87A rebate threshold.',
    ],
  },
  workedExample: {
    title: '₹16,00,000 Gross Salary in FY 2025–26 with ₹4,05,000 Old Regime Deductions',
    scenario: 'A salaried employee earning ₹16,00,000 in FY 2025–26 claiming ₹1,50,000 u/s 80C, ₹25,000 u/s 80D, ₹1,80,000 HRA, and ₹50,000 NPS.',
    inputs: {
      'Gross Salary': '₹16,00,000',
      'Financial Year': 'FY 2025–26 (AY 2026–27)',
      'Old Regime Deductions': '₹4,55,000 (incl. ₹50k Std Ded)',
    },
    stepByStep: [
      'New Regime Taxable Income = ₹16,00,000 − ₹75,000 Std Ded = ₹15,25,000 -> Slab Tax = ₹1,05,000 + 4% Cess = ₹1,09,200.',
      'Old Regime Taxable Income = ₹16,00,000 − ₹4,55,000 = ₹11,45,000 -> Slab Tax = ₹1,56,000 + 4% Cess = ₹1,62,240.',
      'Even with ₹4.05L in Chapter VI-A & HRA deductions, the FY 2025–26 New Regime saves ₹53,040 in tax.',
    ],
    finalResult: 'New Regime Tax: ₹1,09,200 vs Old Regime Tax: ₹1,62,240 (New Regime Saves ₹53,040)',
    interpretation: 'Under the expanded FY 2025–26 slabs, an employee earning ₹16L needs ₹6,25,000 in total deductions (including standard deduction) for the Old Regime to tie the New Regime.',
  },
  howToUse: [
    'Select your Financial Year (FY 2025–26 or FY 2024–25) and age bracket.',
    'Enter your gross annual salary and any other taxable income.',
    'Enter your Chapter VI-A deductions (80C, 80D, 80CCD(1B)), HRA exemption, and home loan interest.',
    'Compare the side-by-side tax cards and check the break-even deduction requirement.',
  ],
  howItIsCalculated: [
    'Applies official CBDT slab rates for both FY 2025–26 (₹4L intervals) and FY 2024–25.',
    'Applies Section 87A tax rebate and marginal relief just above the rebate ceiling.',
    'Uses binary search to compute the exact Old Regime deduction total required to match New Regime tax.',
  ],
  whenToUse: [
    'When submitting your annual investment declaration to HR at the start of the financial year.',
    'When filing your ITR-1 / ITR-2 return to choose the lower-tax regime.',
  ],
  limitations: [
    'High-income surcharges (10% to 25% above ₹50L taxable income) apply separately to ultra-high earners.',
  ],
  sourceReference: {
    organization: 'Central Board of Direct Taxes (CBDT) — Ministry of Finance, Govt. of India',
    standardName: 'Income Tax Act, 1961 — Section 115BAC & Union Budget 2025-26 Finance Bill',
    citation: 'https://www.incometax.gov.in/',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['sip-calculator', 'fd-calculator', 'rd-calculator'],
  relatedConversionPaths: [
    { label: 'HRA Exemption Calculator', path: '/finance/hra-exemption-calculator' },
    { label: 'In-Hand Salary Calculator (CTC)', path: '/finance/in-hand-salary-calculator' },
    { label: 'SIP Calculator', path: '/finance/sip-calculator' },
  ],
  relatedGuidePaths: [
    { title: 'India Capital Gains Tax Calculator', path: '/finance/india-capital-gains-tax-calculator' },
  ],
  faqs: [
    {
      question: 'Is income up to ₹12.75 Lakh completely tax-free for salaried employees in FY 2025-26?',
      answer:
        'Yes. Under the Union Budget 2025-26 New Tax Regime, salaried employees receive a ₹75,000 Standard Deduction (reducing ₹12.75L gross salary to ₹12.00L taxable income), and the enhanced ₹60,000 rebate under Section 87A reduces tax on ₹12.00L taxable income to ₹0.',
    },
  ],
};

export default function IndiaIncomeTaxPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA} currencySymbol="₹">
      <IndiaIncomeTaxClient />
    </CalculatorPageSystem>
  );
}
