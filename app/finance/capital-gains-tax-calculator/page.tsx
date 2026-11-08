import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import CapitalGainsClient from './CapitalGainsClient';

export const metadata: Metadata = {
  title: 'Capital Gains Tax Calculator (US 2025) — Short-Term vs Long-Term & 3.8% NIIT | SolveItCalculator',
  description:
    'Calculate 2025 US short-term and long-term capital gains tax (0%, 15%, 20% brackets), 3.8% Net Investment Income Tax (NIIT), holding period in days, net proceeds, and $3,000 capital loss offset.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/capital-gains-tax-calculator',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'capital-gains-tax-calculator',
  slug: 'capital-gains-tax-calculator',
  name: 'Capital Gains Tax Calculator (US)',
  h1: 'US Capital Gains Tax Calculator (2025 Long-Term, Short-Term & NIIT)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance/taxes',
  canonicalUrl: 'https://solveitcalculator.com/finance/capital-gains-tax-calculator',
  shortAnswer:
    'Calculate your US federal capital gains tax on stocks, crypto, real estate, or collectibles. Automatically determines short-term vs long-term holding periods (> 365 days), stacks gains across the 0% / 15% / 20% 2025 IRS brackets, adds the 3.8% Net Investment Income Tax (NIIT), and models the $3,000 annual capital loss deduction.',
  formula: {
    equation: 'Gain = Sale − Fees − Cost ; Tax = Tax_{LTCG/STCG}(Ordinary + Gain) + 0.038 × min(Gain, max(0, MAGI − Threshold_{NIIT}))',
    description:
      'Long-term capital gains (assets held more than 1 year) sit on top of your ordinary taxable income and are taxed progressively across the 0%, 15%, and 20% brackets (Rev. Proc. 2024-40), plus 3.8% NIIT above $200,000 Single / $250,000 MFJ.',
    variables: [
      { symbol: 'Gain', name: 'Realized Net Capital Gain', unit: 'USD ($)', description: 'Gross sale proceeds minus selling commissions/fees and original cost basis.' },
      { symbol: 'Holding', name: 'Holding Period', unit: 'Days (> 365 = LTCG)', description: 'Assets held 365 days or fewer are taxed as ordinary income; 366+ days qualify for LTCG rates.' },
      { symbol: 'NIIT', name: 'Net Investment Income Tax', unit: '3.8%', description: 'IRC § 1411 surtax on the lesser of net investment income or MAGI above $200k/$250k.' },
    ],
    assumptions: [
      'Capital losses offset capital gains first, and up to $3,000 ($1,500 MFS) of excess loss can offset ordinary income per year with unlimited carryforward.',
    ],
  },
  workedExample: {
    title: '$54,500 Long-Term Stock Gain Stacked on $85,000 Ordinary Taxable Income',
    scenario: 'Single filer with $85,000 taxable ordinary income sells shares bought in May 2023 for $40,000 at $95,000 in August 2025 ($500 fees).',
    inputs: {
      'Cost Basis': '$40,000',
      'Sale Price & Fees': '$95,000 ($500 fees)',
      'Holding Period': '828 days (Long-Term)',
      'Other Taxable Income': '$85,000 (Single)',
    },
    stepByStep: [
      'Net Realized Gain = $95,000 − $500 − $40,000 = $54,500.',
      'Because $85,000 ordinary income exceeds the 2025 Single 0% LTCG ceiling ($48,350), the entire $54,500 gain falls inside the 15% LTCG bracket (up to $533,400).',
      'Base LTCG Tax = $54,500 × 15% = $8,175. Total MAGI ($139,500) is below the $200,000 Single NIIT threshold, so NIIT = $0.',
      'Net Proceeds After Tax = $94,500 − $8,175 = $86,325.',
    ],
    finalResult: '$8,175 Total Capital Gains Tax (15.0% Effective Rate) | $86,325 Net Proceeds',
    interpretation: 'Holding the shares for more than 365 days saved over $4,000 compared to short-term ordinary tax rates (22%–24%).',
  },
  howToUse: [
    'Select your asset class (Stocks/Crypto, Real Estate, or Collectibles) and filing status.',
    'Enter your original purchase price, gross sale price, and any broker or closing fees.',
    'Pick your purchase and sale dates to verify whether your holding exceeds 365 days.',
    'Enter your other taxable income to see how your gain stacks across the 0%, 15%, and 20% brackets.',
  ],
  howItIsCalculated: [
    'Computes exact calendar days between purchase date and sale date (> 365 days = Long-Term).',
    'Stacks Long-Term Capital Gains on top of ordinary taxable income across 2025 IRS thresholds ($48,350 / $533,400 Single; $96,700 / $600,050 MFJ).',
    'Applies 3.8% Net Investment Income Tax (NIIT) on investment income above $200k Single / $250k MFJ.',
  ],
  whenToUse: [
    'Before selling appreciated stocks, ETFs, cryptocurrency, or real estate.',
    'When planning year-end tax-loss harvesting to utilize the $3,000 ordinary income offset.',
  ],
  limitations: [
    'Section 121 primary residence exclusion ($250k Single / $500k MFJ) and Section 1250 depreciation recapture are not automatically deducted.',
  ],
  sourceReference: {
    organization: 'Internal Revenue Service (IRS)',
    standardName: 'IRC § 1(h), § 1211(b), § 1411 & IRS Publication 550',
    citation: 'IRS Revenue Procedure 2024-40 (2025 LTCG Thresholds)',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['us-federal-income-tax-calculator', 'roi-calculator', 'cagr-calculator'],
  relatedConversionPaths: [
    { label: 'India Capital Gains Tax Calculator', path: '/finance/india-capital-gains-tax-calculator' },
    { label: 'US Federal Income Tax Calculator', path: '/finance/us-federal-income-tax-calculator' },
    { label: 'ROI Calculator', path: '/finance/roi-calculator' },
  ],
  relatedGuidePaths: [
    { title: 'CAGR Calculator', path: '/finance/cagr-calculator' },
  ],
  faqs: [
    {
      question: 'How long do I have to hold an asset to qualify for long-term capital gains tax in the US?',
      answer:
        'Under IRS rules, you must hold the asset for MORE than one year (at least 366 days, or 1 year plus 1 day). If you sell on the exact 1-year anniversary (365 days), the gain is taxed as a short-term capital gain at your ordinary income tax rate.',
    },
    {
      question: 'How does the $3,000 capital loss limit work?',
      answer:
        'Capital losses first offset your capital gains dollar-for-dollar with no limit. If your total capital losses exceed your total capital gains for the year, you can deduct up to $3,000 ($1,500 if Married Filing Separately) against ordinary income like W-2 wages, and carry forward any remaining loss to future years.',
    },
  ],
};

export default function CapitalGainsPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <CapitalGainsClient />
    </CalculatorPageSystem>
  );
}
