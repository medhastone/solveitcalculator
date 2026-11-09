import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import CountryTaxTemplateClient from '@/components/calculator/CountryTaxTemplateClient';

export const metadata: Metadata = {
  title: 'Singapore Income Tax & CPF Calculator (YA 2025 IRAS Resident Rates) | SolveItCalculator',
  description:
    'Calculate YA 2025 Singapore net salary after IRAS progressive resident income tax brackets (0% to 24%), Earned Income Relief, and mandatory 20% CPF employee contributions.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/singapore-income-tax-calculator',
  },
  openGraph: {
    title: 'Singapore Income Tax & CPF Calculator (YA 2025 IRAS Resident Rates) | SolveItCalculator',
    description: 'Calculate YA 2025 Singapore net salary after IRAS progressive resident income tax brackets (0% to 24%), Earned Income Relief, and mandatory 20% CPF employee contributions.',
    url: 'https://solveitcalculator.com/finance/singapore-income-tax-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Singapore Income Tax & CPF Calculator (YA 2025 IRAS Resident Rates) | SolveItCalculator',
    description: 'Calculate YA 2025 Singapore net salary after IRAS progressive resident income tax brackets (0% to 24%), Earned Income Relief, and mandatory 20% CPF employee contributions.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'singapore-income-tax-calculator',
  slug: 'singapore-income-tax-calculator',
  name: 'Singapore Income Tax Calculator',
  h1: 'Singapore Income Tax & CPF Calculator (YA 2025 IRAS Resident Schedule)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance',
  canonicalUrl: 'https://solveitcalculator.com/finance/singapore-income-tax-calculator',
  shortAnswer:
    'Calculate your Singapore net take-home pay in SGD using official YA 2025 Inland Revenue Authority of Singapore (IRAS) resident progressive tax brackets (0% up to S$20,000; top rate 24% above S$1M) and Central Provident Fund (CPF) 20% employee contributions.',
  formula: {
    equation: 'Net = Gross − CPF_{Employee} − Tax_{IRAS}(Gross − CPF_{Employee} − Reliefs)',
    description:
      'Deducts 20% employee CPF (for Singapore Citizens/PRs up to the S$7,400/month Ordinary Wage ceiling = S$88,800/yr) and S$1,000 Earned Income Relief before applying the 13-tier IRAS resident progressive tax schedule.',
    variables: [
      { symbol: 'CPF', name: 'Employee CPF Contribution (Under 55)', unit: '20% up to S$88,800 OW', description: 'Mandatory Central Provident Fund savings for Singapore Citizens and PRs (0% for Employment Pass foreigners).' },
      { symbol: 'IRAS', name: 'Resident Progressive Tax Rate', unit: '0% to 24%', description: 'First S$20,000 is tax-free; progressive bands up to 24% above S$1,000,000.' },
    ],
    assumptions: ['Employment Pass (EP) / S-Pass holders can uncheck the CPF box to calculate tax without CPF deductions.'],
  },
  workedExample: {
    title: 'S$120,000 Annual Salary in Singapore (Citizen vs Employment Pass)',
    scenario: 'Earning S$10,000/month (S$120,000/yr) in Singapore in YA 2025.',
    inputs: { 'Gross Salary': 'S$120,000/year', 'Status': 'Singapore Citizen (20% CPF)' },
    stepByStep: [
      'Employee CPF (20% capped at S$88,800 Ordinary Wage ceiling) = S$17,760.',
      'Chargeable Income = S$120,000 − S$17,760 CPF − S$1,000 Earned Income Relief = S$101,240.',
      'IRAS Resident Income Tax on S$101,240 = S$5,836.',
      'Annual Net Take-Home Pay = S$120,000 − S$17,760 − S$5,836 = S$96,404 (effective income tax rate: 4.86%).',
    ],
    finalResult: 'S$5,836 IRAS Income Tax (4.86% Effective Tax Rate) | S$96,404 Net Cash',
    interpretation: 'Singapore’s low progressive income tax rates keep the effective tax burden under 5% at S$120,000.',
  },
  howToUse: ['Enter your annual gross income in Singapore Dollars (S$).', 'Toggle the CPF checkbox on if you are a Singapore Citizen/PR or off if you hold an Employment Pass.', 'Review your IRAS tax, CPF contribution, and 18 April e-Filing deadline.'],
  howItIsCalculated: ['Applies verified YA 2025 IRAS resident tax brackets and 2025 CPF Ordinary Wage ceiling (S$7,400/month).'],
  whenToUse: ['When evaluating a Singapore job offer as a Citizen, PR, or Employment Pass holder.'],
  limitations: ['Total personal reliefs are capped at S$80,000 per Year of Assessment under IRAS rules.'],
  sourceReference: {
    organization: 'Inland Revenue Authority of Singapore (IRAS) & CPF Board',
    standardName: 'Income Tax Act 1947 — YA 2025 Resident Tax Rates',
    citation: 'https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['uk-paye-calculator', 'us-federal-income-tax-calculator', 'salary-to-hourly-calculator'],
  relatedConversionPaths: [
    { label: 'UAE Income Tax Calculator', path: '/finance/uae-income-tax-calculator' },
    { label: 'Germany Income Tax Calculator', path: '/finance/germany-income-tax-calculator' },
    { label: 'France Income Tax Calculator', path: '/finance/france-income-tax-calculator' },
  ],
  relatedGuidePaths: [{ title: 'UK PAYE Tax Calculator', path: '/finance/uk-paye-calculator' }],
  faqs: [
    {
      question: 'Do foreigners on an Employment Pass (EP) in Singapore pay CPF?',
      answer: 'No. Mandatory Central Provident Fund (CPF) contributions apply only to Singapore Citizens and Singapore Permanent Residents (PRs). Foreign professionals on an Employment Pass or S-Pass pay 0% CPF and only pay IRAS resident income tax (if working in Singapore for 183+ days).',
    },
  ],
};

export default function SingaporeTaxPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA} currencySymbol="S$">
      <CountryTaxTemplateClient initialCountry="singapore" />
    </CalculatorPageSystem>
  );
}
