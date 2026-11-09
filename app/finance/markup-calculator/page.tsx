import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import MarkupClient from './MarkupClient';

export const metadata: Metadata = {
  title: 'Markup Calculator (Cost to Selling Price, Margin %, Discount & Tax) | SolveItCalculator',
  description:
    'Calculate selling price, gross profit, and equivalent gross margin % from cost and markup percentage. Includes promotional discount and sales tax / GST / VAT options.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/markup-calculator',
  },
  openGraph: {
    title: 'Markup Calculator (Cost to Selling Price, Margin %, Discount & Tax) | SolveItCalculator',
    description: 'Calculate selling price, gross profit, and equivalent gross margin % from cost and markup percentage. Includes promotional discount and sales tax / GST / VAT options.',
    url: 'https://solveitcalculator.com/finance/markup-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Markup Calculator (Cost to Selling Price, Margin %, Discount & Tax) | SolveItCalculator',
    description: 'Calculate selling price, gross profit, and equivalent gross margin % from cost and markup percentage. Includes promotional discount and sales tax / GST / VAT options.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'markup-calculator',
  slug: 'markup-calculator',
  name: 'Markup Calculator',
  h1: 'Markup, Selling Price & Gross Margin Calculator',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'business',
  subcategoryName: 'Business Finance',
  subcategoryPath: '/finance/business',
  canonicalUrl: 'https://solveitcalculator.com/finance/markup-calculator',
  shortAnswer:
    'Calculate your list selling price, net price after promotional discounts, unit profit, equivalent gross margin %, and final tax-inclusive customer price from unit cost and markup percentage.',
  formula: {
    equation: 'Price = Cost × (1 + Markup) ; Margin = Markup / (1 + Markup)',
    description:
      'Multiplies unit cost by (1 + Markup %) to determine list selling price, applies any promotional discount, and computes both the resulting profit and equivalent gross margin percentage.',
    variables: [
      { symbol: 'Cost', name: 'Unit Cost (COGS)', unit: 'USD ($)', description: 'Direct wholesale or manufacturing cost of the item.' },
      { symbol: 'Markup', name: 'Markup Percentage', unit: 'Percentage (%)', description: 'Percentage added on top of unit cost.' },
    ],
    assumptions: ['Sales tax / GST / VAT is collected from the customer and remitted to the tax authority, so profit and margin are calculated on pre-tax net selling price.'],
  },
  workedExample: {
    title: '$80 Cost with 50% Markup and 8.25% Sales Tax',
    scenario: 'Marking up an $80 wholesale item by 50% with 8.25% sales tax.',
    inputs: { 'Unit Cost': '$80.00', 'Markup %': '50%', 'Sales Tax': '8.25%' },
    stepByStep: [
      'Selling Price (Pre-Tax) = $80.00 × 1.50 = $120.00.',
      'Gross Profit = $120.00 − $80.00 = $40.00 (Equivalent Gross Margin = $40 ÷ $120 = 33.33%).',
      'Final Checkout Price with 8.25% Tax ($9.90) = $129.90.',
    ],
    finalResult: '$120.00 Selling Price ($129.90 with Tax) | $40.00 Profit (33.33% Margin)',
    interpretation: 'Applying a 20% promotional discount to the $120 list price drops the net price to $96 and cuts profit in half to $16.',
  },
  howToUse: [
    'Enter your unit cost and desired markup percentage (or list selling price).',
    'Optionally enter a promotional discount % and sales tax / GST / VAT %.',
    'Review your net pre-tax price, dollar profit, equivalent margin %, and final customer checkout price.',
  ],
  howItIsCalculated: [
    'Computes List Price = Cost × (1 + Markup / 100) and applies (1 − Discount / 100).',
    'Computes Profit = Net Price − Cost and Gross Margin = Profit / Net Price.',
  ],
  whenToUse: ['When setting retail catalog prices or testing whether a promotional discount erodes your profit margin.'],
  limitations: ['Does not include fixed store overhead (use the Break-Even Calculator to include fixed costs).'],
  sourceReference: {
    organization: 'Retail & Managerial Accounting Standards',
    standardName: 'Cost-Plus Markup & Promotional Discount Equations',
    citation: 'GAAP Gross Margin Accounting',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['roi-calculator'],
  relatedConversionPaths: [
    { label: 'Margin Calculator', path: '/finance/margin-calculator' },
    { label: 'Break-Even Calculator', path: '/finance/break-even-calculator' },
    { label: 'Profit Margin Calculator', path: '/finance/profit-margin-calculator' },
  ],
  relatedGuidePaths: [{ title: 'Margin Calculator', path: '/finance/margin-calculator' }],
  faqs: [
    {
      question: 'What is "Keystone Markup" in retail?',
      answer: 'Keystone pricing is a 100% markup (doubling the wholesale cost), which produces a 50.0% gross margin.',
    },
  ],
};

export default function MarkupPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <MarkupClient />
    </CalculatorPageSystem>
  );
}
