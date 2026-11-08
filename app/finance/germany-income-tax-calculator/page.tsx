import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import CountryTaxTemplateClient from '@/components/calculator/CountryTaxTemplateClient';

export const metadata: Metadata = {
  title: 'Germany Income Tax Calculator (2025 BMF § 32a EStG & Social Security) | SolveItCalculator',
  description:
    'Calculate 2025 German net salary after Einkommensteuer (§ 32a EStG), Grundfreibetrag (€12,096), Ehegattensplitting, Kirchensteuer, and statutory social security contributions (RV, KV, AV, PV).',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/germany-income-tax-calculator',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'germany-income-tax-calculator',
  slug: 'germany-income-tax-calculator',
  name: 'Germany Income Tax Calculator',
  h1: 'Germany Income Tax & Net Salary Calculator (2025 BMF § 32a EStG)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Taxes & Statutory Withholdings',
  subcategoryPath: '/finance/taxes',
  canonicalUrl: 'https://solveitcalculator.com/finance/germany-income-tax-calculator',
  shortAnswer:
    'Calculate your 2025 German net take-home salary after Einkommensteuer (§ 32a EStG), the €12,096 Grundfreibetrag, employee social security contributions (Pension, Health, Unemployment, Care), and optional Church Tax.',
  formula: {
    equation: 'Net = Gross − Social_{RV+KV+AV+PV} − ESt(zvE) − Kirchensteuer',
    description:
      'Applies German employee social insurance caps (€96,600 RV/AV; €66,150 KV/PV), the €1,230 Werbungskostenpauschale, and § 32a EStG 2025 brackets with €12,096 Grundfreibetrag.',
    variables: [
      { symbol: 'Grundfreibetrag', name: '2025 Basic Tax-Free Allowance', unit: '€12,096 (€24,192 Joint)', description: 'Zero-tax floor under the Steuerfortentwicklungsgesetz 2025.' },
      { symbol: 'Social', name: 'Employee Social Security Share', unit: '~20.8% capped at BBG', description: 'Includes 9.3% RV, 8.15% KV, 1.3% AV, and 1.8% PV.' },
    ],
    assumptions: ['Assumes statutory public health insurance (GKV) with average 2.5% Zusatzbeitrag.'],
  },
  workedExample: {
    title: '€75,000 Gross Salary in Germany (Single, Tax Class I)',
    scenario: 'Single employee in Germany earning €75,000/yr in 2025 without Church Tax.',
    inputs: { 'Gross Salary': '€75,000', 'Filing Status': 'Single (Steuerklasse I)' },
    stepByStep: [
      'Employee Social Contributions = €7,950 (RV/AV on €75k) + €6,582 (KV/PV capped at €66,150) = €14,532.',
      'Taxable Income (zvE) = €75,000 − €14,532 − €1,230 = €59,238.',
      'Income Tax (§ 32a EStG) = ~€11,314 -> Annual Net Pay = €49,154 (€4,096/month).',
    ],
    finalResult: '€49,154/year Net (€4,096/month) | 34.5% Effective Deduction Rate',
    interpretation: 'Social security contributions make up more than half of the total payroll deduction at middle-to-upper income levels.',
  },
  howToUse: ['Enter your annual gross salary in Euros (€).', 'Select Single or Married Joint Splitting (Ehegattensplitting).', 'Toggle optional 9% Church Tax and review local BMF filing deadlines.'],
  howItIsCalculated: ['Applies 2025 Beitragsbemessungsgrenzen and § 32a EStG rates verified from BMF Germany.'],
  whenToUse: ['When evaluating a job contract in Berlin, Munich, Frankfurt, or Hamburg.'],
  limitations: ['Private health insurance (PKV) and company car (Dienstwagen) fringe benefits are not included.'],
  sourceReference: {
    organization: 'Bundesministerium der Finanzen (BMF Germany)',
    standardName: 'Einkommensteuergesetz (EStG) § 32a — Tarif 2025',
    citation: 'https://www.bundesfinanzministerium.de/',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['uk-paye-calculator', 'us-federal-income-tax-calculator', 'salary-to-hourly-calculator'],
  relatedConversionPaths: [
    { label: 'France Income Tax Calculator', path: '/finance/france-income-tax-calculator' },
    { label: 'UAE Income Tax Calculator', path: '/finance/uae-income-tax-calculator' },
    { label: 'Singapore Income Tax Calculator', path: '/finance/singapore-income-tax-calculator' },
  ],
  relatedGuidePaths: [{ title: 'UK PAYE Tax Calculator', path: '/finance/uk-paye-calculator' }],
  faqs: [
    {
      question: 'What is the tax-free allowance (Grundfreibetrag) in Germany for 2025?',
      answer: 'For the 2025 tax year, the German basic tax-free allowance (Grundfreibetrag) under § 32a EStG is €12,096 for single taxpayers and €24,192 for married couples filing jointly.',
    },
  ],
};

export default function GermanyTaxPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA} currencySymbol="€">
      <CountryTaxTemplateClient initialCountry="germany" />
    </CalculatorPageSystem>
  );
}
