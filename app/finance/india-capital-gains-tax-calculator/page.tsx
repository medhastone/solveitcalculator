import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import IndiaCapitalGainsClient from './IndiaCapitalGainsClient';

export const metadata: Metadata = {
  title: 'India Capital Gains Tax Calculator (Sec 112A LTCG 12.5% & Sec 111A STCG 20%) | SolveItCalculator',
  description:
    'Calculate India LTCG and STCG tax on listed equity shares, mutual funds, real estate, and gold under Finance (No. 2) Act 2024. Includes ₹1,25,000 Section 112A exemption, 12.5% LTCG, 20% STCG, and 4% cess.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/india-capital-gains-tax-calculator',
  },
  openGraph: {
    title: 'India Capital Gains Tax Calculator (Sec 112A LTCG 12.5% & Sec 111A STCG 20%) | SolveItCalculator',
    description: 'Calculate India LTCG and STCG tax on listed equity shares, mutual funds, real estate, and gold under Finance (No. 2) Act 2024. Includes ₹1,25,000 Section 112A exemption, 12.5% LTCG, 20% STCG, and 4% cess.',
    url: 'https://solveitcalculator.com/finance/india-capital-gains-tax-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India Capital Gains Tax Calculator (Sec 112A LTCG 12.5% & Sec 111A STCG 20%) | SolveItCalculator',
    description: 'Calculate India LTCG and STCG tax on listed equity shares, mutual funds, real estate, and gold under Finance (No. 2) Act 2024. Includes ₹1,25,000 Section 112A exemption, 12.5% LTCG, 20% STCG, and 4% cess.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'india-capital-gains-tax-calculator',
  slug: 'india-capital-gains-tax-calculator',
  name: 'India Capital Gains Tax Calculator',
  h1: 'India Capital Gains Tax Calculator (LTCG 12.5%, STCG 20% & ₹1.25L Sec 112A Exemption)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance',
  canonicalUrl: 'https://solveitcalculator.com/finance/india-capital-gains-tax-calculator',
  shortAnswer:
    'Compute your Indian short-term and long-term capital gains tax on listed equity shares, equity mutual funds, real estate, and debt funds using the updated Finance (No. 2) Act, 2024 rates (12.5% LTCG above ₹1,25,000 u/s 112A; 20% STCG u/s 111A).',
  formula: {
    equation: 'LTCG_{Tax} = 1.04 × [0.125 × max(0, Gain − ₹1,25,000)] ; STCG_{Tax} = 1.04 × [0.20 × Gain]',
    description:
      'Effective 23 July 2024, listed equity LTCG (held > 12 months) is exempt up to ₹1,25,000 per financial year and taxed at 12.5% on excess gains, while STCG (held <= 12 months) is taxed at 20%, plus 4% Health & Education Cess.',
    variables: [
      { symbol: '₹1,25,000', name: 'Section 112A Annual Exemption', unit: 'INR (₹/FY)', description: 'Annual tax-free LTCG allowance on STT-paid listed equity shares and equity-oriented mutual funds.' },
      { symbol: '12.5%', name: 'Long-Term Capital Gains Rate', unit: 'Percentage', description: 'Unified LTCG tax rate under Section 112A / 112 effective 23 July 2024.' },
      { symbol: '20.0%', name: 'Short-Term Equity STCG Rate', unit: 'Percentage', description: 'Section 111A STCG rate on listed equity shares and equity mutual funds held 12 months or less.' },
    ],
    assumptions: [
      'Securities Transaction Tax (STT) is assumed paid on listed equity and equity mutual fund transactions.',
    ],
  },
  workedExample: {
    title: '₹7,45,000 Listed Equity LTCG Held for 18 Months',
    scenario: 'Selling listed Indian equity shares bought for ₹5,00,000 at ₹12,50,000 after 18 months (₹5,000 brokerage).',
    inputs: {
      'Purchase Price': '₹5,00,000',
      'Net Sale Proceeds': '₹12,45,000',
      'Holding Period': '18 Months (> 12 Months = LTCG)',
    },
    stepByStep: [
      'Total Long-Term Capital Gain = ₹12,45,000 − ₹5,00,000 = ₹7,45,000.',
      'Subtract Section 112A Annual Exemption of ₹1,25,000 -> Taxable LTCG = ₹6,20,000.',
      'Base LTCG Tax @ 12.5% = ₹77,500; plus 4% Cess (₹3,100) = ₹80,600 Total Tax.',
    ],
    finalResult: '₹80,600 Total LTCG Tax | ₹11,64,400 Net Post-Tax Proceeds',
    interpretation: 'The ₹1,25,000 annual exemption saves ₹16,250 in tax every financial year when harvesting long-term equity gains.',
  },
  howToUse: [
    'Select your Indian asset class (Listed Equity/MF, Real Estate/Gold, or Specified Debt MF).',
    'Enter your purchase cost, sale value, and holding period in months.',
    'Review the automatic ₹1,25,000 Section 112A exemption, base tax, and 4% Health & Education Cess.',
  ],
  howItIsCalculated: [
    'Applies the 12-month LTCG cutoff for listed securities and 24-month cutoff for real estate/gold/unlisted shares.',
    'Deducts ₹1,25,000 from listed equity LTCG before applying the 12.5% tax rate and 4% cess.',
  ],
  whenToUse: [
    'When redeeming Indian mutual fund SIPs or booking profits in NSE/BSE stocks.',
    'For annual March LTCG tax-gain harvesting up to the ₹1,25,000 tax-free threshold.',
  ],
  limitations: [
    'Section 54/54F residential property reinvestment exemptions and grandfathering prior to 31 Jan 2018 are modeled separately.',
  ],
  sourceReference: {
    organization: 'Income Tax Department of India (CBDT)',
    standardName: 'Income Tax Act, 1961 — Sections 111A, 112, 112A & 50AA (Finance Act 2024)',
    citation: 'Finance (No. 2) Act, 2024 effective 23 July 2024',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['capital-gains-tax-calculator', 'sip-calculator', 'roi-calculator'],
  relatedConversionPaths: [
    { label: 'India Income Tax Calculator', path: '/finance/india-income-tax-calculator' },
    { label: 'SIP Calculator', path: '/compound-interest-calculator' },
    { label: 'US Capital Gains Calculator', path: '/finance/capital-gains-tax-calculator' },
  ],
  relatedGuidePaths: [
    { title: 'HRA Exemption Calculator', path: '/finance/hra-exemption-calculator' },
  ],
  faqs: [
    {
      question: 'What is the new LTCG and STCG tax rate on shares and equity mutual funds in India?',
      answer:
        'Under the Finance (No. 2) Act 2024 (effective 23 July 2024), Short-Term Capital Gains (STCG u/s 111A) on listed equity and equity mutual funds increased from 15% to 20%. Long-Term Capital Gains (LTCG u/s 112A) increased from 10% to 12.5%, while the annual tax-free LTCG exemption increased from ₹1,00,000 to ₹1,25,000.',
    },
  ],
};

export default function IndiaCapitalGainsPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA} currencySymbol="₹">
      <IndiaCapitalGainsClient />
    </CalculatorPageSystem>
  );
}
