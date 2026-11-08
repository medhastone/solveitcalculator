import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import CountryTaxTemplateClient from '@/components/calculator/CountryTaxTemplateClient';

export const metadata: Metadata = {
  title: 'UAE Salary & Income Tax Calculator (2025 0% Tax & GPSSA Pension) | SolveItCalculator',
  description:
    'Calculate 2025 UAE (Dubai & Abu Dhabi) net take-home salary under the 0% Personal Income Tax regime for expatriates and 5% GPSSA social pension rules for UAE Nationals.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/uae-income-tax-calculator',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'uae-income-tax-calculator',
  slug: 'uae-income-tax-calculator',
  name: 'UAE Income Tax Calculator',
  h1: 'UAE Salary & Income Tax Calculator (2025 — 0% Personal Tax & GPSSA)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance/taxes',
  canonicalUrl: 'https://solveitcalculator.com/finance/uae-income-tax-calculator',
  shortAnswer:
    'Calculate your 2025 United Arab Emirates (Dubai / Abu Dhabi) take-home salary in AED. Verifies the 0% Personal Income Tax schedule under UAE Federal Decree-Law No. 47 of 2022 and optional 5% GPSSA pension deductions for UAE Nationals.',
  formula: {
    equation: 'Net_{Expat} = Gross ; Net_{UAE\\_National} = Gross − 0.05 × min(Gross, AED 840,000)',
    description:
      'Employment salaries, allowances, and personal investment income in the UAE are subject to 0% Personal Income Tax. UAE Nationals contribute 5% of pensionable salary to GPSSA.',
    variables: [
      { symbol: '0%', name: 'UAE Personal Income Tax Rate', unit: '0% Statutory', description: 'Employment wages and personal income are exempt from tax.' },
      { symbol: '5%', name: 'GPSSA UAE National Employee Share', unit: '5% of Salary', description: 'Applies only to UAE / GCC Nationals up to AED 70,000/month.' },
    ],
    assumptions: ['Expatriate employees pay 0% income tax and 0% employee social security, and accrue End-of-Service Gratuity paid by the employer.'],
  },
  workedExample: {
    title: 'AED 360,000 Annual Salary in Dubai (Expatriate vs UAE National)',
    scenario: 'Comparing AED 30,000/month (AED 360,000/yr) in Dubai for an expatriate vs a UAE National.',
    inputs: { 'Gross Salary': 'AED 360,000/year' },
    stepByStep: [
      'Personal Income Tax = AED 0 (0%).',
      'Expatriate Net Take-Home Pay = AED 360,000/year (AED 30,000/month).',
      'UAE National Net Pay (after 5% GPSSA = AED 18,000) = AED 342,000/year (AED 28,500/month).',
    ],
    finalResult: 'AED 360,000/yr Net (Expat) | AED 342,000/yr Net (UAE National)',
    interpretation: '100% of gross salary is retained by expatriate employees in the UAE.',
  },
  howToUse: ['Enter your annual gross salary in UAE Dirhams (AED).', 'Toggle the UAE National GPSSA checkbox if you hold UAE citizenship.', 'Review official UAE Ministry of Finance exclusions (9% Corporate Tax applies only to businesses above AED 375k profit, not employment wages).'],
  howItIsCalculated: ['Applies verified UAE Ministry of Finance & Federal Tax Authority (FTA) personal tax rules.'],
  whenToUse: ['When evaluating a tax-free relocation package to Dubai or Abu Dhabi.'],
  limitations: ['5% UAE VAT on consumer purchases and 5% Dubai Municipality housing fee on annual rent are paid separately.'],
  sourceReference: {
    organization: 'UAE Ministry of Finance & Federal Tax Authority (FTA)',
    standardName: 'UAE Federal Decree-Law No. 47 of 2022 & Federal Law No. 57 of 2023 (GPSSA)',
    citation: 'https://mof.gov.ae/tax-legislation/',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['uk-paye-calculator', 'us-federal-income-tax-calculator', 'salary-to-hourly-calculator'],
  relatedConversionPaths: [
    { label: 'Singapore Income Tax Calculator', path: '/finance/singapore-income-tax-calculator' },
    { label: 'Germany Income Tax Calculator', path: '/finance/germany-income-tax-calculator' },
    { label: 'France Income Tax Calculator', path: '/finance/france-income-tax-calculator' },
  ],
  relatedGuidePaths: [{ title: 'UK PAYE Tax Calculator', path: '/finance/uk-paye-calculator' }],
  faqs: [
    {
      question: 'Does the 9% UAE Corporate Tax apply to my employment salary?',
      answer: 'No. Under Article 4 of UAE Federal Decree-Law No. 47 of 2022, wages, salaries, and personal investment or real estate income of natural persons are completely outside the scope of the 9% UAE Corporate Tax.',
    },
  ],
};

export default function UaeTaxPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA} currencySymbol="AED ">
      <CountryTaxTemplateClient initialCountry="uae" />
    </CalculatorPageSystem>
  );
}
