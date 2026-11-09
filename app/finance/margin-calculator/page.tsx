import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import MarginClient from './MarginClient';

export const metadata: Metadata = {
  title: 'Margin Calculator (Gross Margin %, Profit, Selling Price & Markup Table) | SolveItCalculator',
  description:
    'Solve for Gross Margin %, Selling Price, or Cost from any two inputs. Includes Gross Profit, equivalent Markup %, and a Margin vs. Markup conversion table.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/margin-calculator',
  },
  openGraph: {
    title: 'Margin Calculator (Gross Margin %, Profit, Selling Price & Markup Table) | SolveItCalculator',
    description: 'Solve for Gross Margin %, Selling Price, or Cost from any two inputs. Includes Gross Profit, equivalent Markup %, and a Margin vs. Markup conversion table.',
    url: 'https://solveitcalculator.com/finance/margin-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Margin Calculator (Gross Margin %, Profit, Selling Price & Markup Table) | SolveItCalculator',
    description: 'Solve for Gross Margin %, Selling Price, or Cost from any two inputs. Includes Gross Profit, equivalent Markup %, and a Margin vs. Markup conversion table.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'margin-calculator',
  slug: 'margin-calculator',
  name: 'Margin Calculator',
  h1: 'Gross Margin, Selling Price & Markup Calculator',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'business',
  subcategoryName: 'Business Finance',
  subcategoryPath: '/finance/business',
  canonicalUrl: 'https://solveitcalculator.com/finance/margin-calculator',
  shortAnswer:
    'Enter any two of Cost, Selling Price/Revenue, or Gross Margin % to solve for the third. Instantly computes gross profit, equivalent markup percentage, and a side-by-side Margin vs. Markup reference table.',
  formula: {
    equation: 'Margin = (Revenue − Cost) / Revenue ; Price = Cost / (1 − Margin) ; Markup = (Revenue − Cost) / Cost',
    description:
      'Gross margin measures profit as a percentage of selling price (revenue), whereas markup measures profit as a percentage of unit cost (COGS).',
    variables: [
      { symbol: 'Margin', name: 'Gross Profit Margin', unit: 'Percentage (%)', description: 'Gross profit divided by selling price.' },
      { symbol: 'Markup', name: 'Markup Percentage', unit: 'Percentage (%)', description: 'Gross profit divided by unit cost.' },
    ],
    assumptions: ['Gross margin is strictly less than 100% whenever unit cost is greater than zero.'],
  },
  workedExample: {
    title: '$60 Unit Cost Priced for a 40% Gross Margin',
    scenario: 'A retailer buys a product for $60 and wants to achieve a 40% gross margin.',
    inputs: { 'Unit Cost': '$60.00', 'Target Gross Margin': '40.0%' },
    stepByStep: [
      'Required Selling Price = $60.00 ÷ (1 − 0.40) = $60.00 ÷ 0.60 = $100.00.',
      'Gross Profit = $100.00 − $60.00 = $40.00.',
      'Equivalent Markup on Cost = $40.00 ÷ $60.00 = 66.67% Markup.',
    ],
    finalResult: '$100.00 Selling Price | $40.00 Gross Profit | 66.67% Equivalent Markup',
    interpretation: 'Confusing a 40% margin with a 40% markup ($84 price) would cost $16 per unit in lost profit.',
  },
  howToUse: [
    'Select which two variables you know (Cost & Price, Cost & Margin %, or Price & Margin %).',
    'Enter your values or drag the unboxed sliders.',
    'Review Gross Margin %, Gross Profit, Equivalent Markup %, and the conversion table.',
  ],
  howItIsCalculated: [
    'Computes Gross Profit = Revenue − Cost.',
    'Divides Gross Profit by Revenue for Margin % and by Cost for Markup %.',
  ],
  whenToUse: ['When pricing retail, e-commerce, wholesale, or SaaS products to hit target gross margins.'],
  limitations: ['Evaluates unit gross profit before fixed operating overhead, interest, and income taxes (see Profit Margin Calculator for full P&L).'],
  sourceReference: {
    organization: 'FASB / GAAP & Corporate Finance Accounting Standards',
    standardName: 'Gross Profit Margin & Retail Markup Identities',
    citation: 'ASC 220 (Income Statement)',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['roi-calculator'],
  relatedConversionPaths: [
    { label: 'Markup Calculator', path: '/finance/markup-calculator' },
    { label: 'Profit Margin Calculator', path: '/finance/profit-margin-calculator' },
    { label: 'Break-Even Calculator', path: '/finance/break-even-calculator' },
  ],
  relatedGuidePaths: [{ title: 'Break-Even Calculator', path: '/finance/break-even-calculator' }],
  faqs: [
    {
      question: 'Why does a 50% markup only equal a 33.33% margin?',
      answer: 'If an item costs $100 and you mark it up by 50%, you add $50 to sell it for $150. Your $50 profit divided by the $150 selling price is $50 / $150 = 33.33% gross margin. To earn a 50% gross margin, you must use a 100% markup (doubling the cost to $200).',
    },
  ],
};

export default function MarginPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <MarginClient />
    </CalculatorPageSystem>
  );
}
