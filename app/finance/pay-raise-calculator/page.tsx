import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import PayRaiseClient from './PayRaiseClient';

export const metadata: Metadata = {
  title: 'Pay Raise Calculator (Percentage Increase, New Pay & Real Inflation Gain) | SolveItCalculator',
  description:
    'Calculate your new salary, monthly, bi-weekly, and hourly pay after a raise. Computes Fisher equation real purchasing power gain after inflation and multi-year salary compounding.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/pay-raise-calculator',
  },
  openGraph: {
    title: 'Pay Raise Calculator (Percentage Increase, New Pay & Real Inflation Gain) | SolveItCalculator',
    description: 'Calculate your new salary, monthly, bi-weekly, and hourly pay after a raise. Computes Fisher equation real purchasing power gain after inflation and multi-year salary compounding.',
    url: 'https://solveitcalculator.com/finance/pay-raise-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pay Raise Calculator (Percentage Increase, New Pay & Real Inflation Gain) | SolveItCalculator',
    description: 'Calculate your new salary, monthly, bi-weekly, and hourly pay after a raise. Computes Fisher equation real purchasing power gain after inflation and multi-year salary compounding.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'pay-raise-calculator',
  slug: 'pay-raise-calculator',
  name: 'Pay Raise Calculator',
  h1: 'Pay Raise & Real Purchasing Power Calculator',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'salary',
  subcategoryName: 'Salary & Payroll',
  subcategoryPath: '/finance/salary',
  canonicalUrl: 'https://solveitcalculator.com/finance/pay-raise-calculator',
  shortAnswer:
    'Calculate your new pay across annual, monthly, bi-weekly, and hourly periods from a percentage raise or target salary. Includes the Fisher equation real raise after inflation and multi-year compounding.',
  formula: {
    equation: 'New = Old × (1 + Raise) ; RealRaise = [(1 + Raise) / (1 + Inflation)] − 1',
    description:
      'Applies your nominal raise percentage across all payroll frequencies and deflates by CPI inflation using the exact Fisher equation to measure real purchasing power growth.',
    variables: [
      { symbol: 'Raise', name: 'Nominal Pay Raise', unit: 'Decimal (% / 100)', description: 'Percentage increase in gross compensation.' },
      { symbol: 'RealRaise', name: 'Inflation-Adjusted Real Raise', unit: 'Percentage', description: 'True purchasing power change after accounting for cost-of-living inflation.' },
    ],
    assumptions: ['Assumes constant weekly hours before and after the raise.'],
  },
  workedExample: {
    title: '6% Pay Raise on $85,000 Salary with 2.8% Inflation',
    scenario: 'An employee earning $85,000 receives a 6.0% merit raise while annual CPI inflation is 2.8%.',
    inputs: { 'Current Salary': '$85,000', 'Raise Percentage': '6.0%', 'Inflation Rate': '2.8%' },
    stepByStep: [
      'New Annual Salary = $85,000 × 1.06 = $90,100 (+$5,100/year or +$196.15/bi-weekly).',
      'New Hourly Rate (2,080 hrs) = $43.32/hr (+$2.45/hr).',
      'Real Inflation-Adjusted Raise = (1.06 ÷ 1.028) − 1 = +3.11% real purchasing power gain.',
    ],
    finalResult: '$90,100/year New Salary (+$5,100/yr) | +3.11% Real Raise After Inflation',
    interpretation: 'Because the 6.0% raise exceeds the 2.8% inflation rate, your real standard of living rises by 3.11%.',
  },
  howToUse: [
    'Select your pay period (Annual, Monthly, or Hourly) and enter your current pay.',
    'Choose Raise by % or Enter New Pay.',
    'Adjust the CPI inflation slider to inspect your real purchasing power gain and 5-year compounding schedule.',
  ],
  howItIsCalculated: [
    'Computes nominal pay differences across annual, monthly (12), bi-weekly (26), and hourly periods.',
    'Applies the Fisher equation (1 + r) / (1 + i) − 1 for real raise calculation.',
  ],
  whenToUse: ['During annual performance reviews, cost-of-living adjustments (COLA), or promotion negotiations.'],
  limitations: ['Shows pre-tax gross raise before marginal income tax withholding.'],
  sourceReference: {
    organization: 'U.S. Bureau of Labor Statistics (BLS) — Consumer Price Index & Real Earnings',
    standardName: 'Fisher Real Wage Equation',
    citation: 'https://www.bls.gov/news.release/realer.toc.htm',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['inflation-calculator', 'salary-to-hourly-calculator', 'take-home-pay-calculator'],
  relatedConversionPaths: [
    { label: 'Inflation Calculator', path: '/finance/real-rate-of-return-calculator' },
    { label: 'Salary to Hourly Calculator', path: '/finance/salary-to-hourly-calculator' },
    { label: 'Take-Home Pay Calculator', path: '/finance/take-home-pay-calculator' },
  ],
  relatedGuidePaths: [{ title: 'Overtime Pay Calculator', path: '/finance/overtime-pay-calculator' }],
  faqs: [
    {
      question: 'Why is my real raise slightly different from (Raise % minus Inflation %)?',
      answer: 'Subtracting inflation from your raise is an approximation. The exact mathematical formula is the Fisher equation: (1 + Raise) / (1 + Inflation) − 1, because inflation also erodes the purchasing power of the raise dollars themselves.',
    },
  ],
};

export default function PayRaisePage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <PayRaiseClient />
    </CalculatorPageSystem>
  );
}
