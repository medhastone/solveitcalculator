import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import BreakEvenClient from './BreakEvenClient';

export const metadata: Metadata = {
  title: 'Break-Even Calculator (BEP Units, Revenue, Contribution Margin & Margin of Safety) | SolveItCalculator',
  description:
    'Calculate your Break-Even Point (BEP) in units and revenue, contribution margin ratio, units required for target profit, margin of safety, and ±10% price sensitivity.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/break-even-calculator',
  },
  openGraph: {
    title: 'Break-Even Calculator (BEP Units, Revenue, Contribution Margin & Margin of Safety) | SolveItCalculator',
    description: 'Calculate your Break-Even Point (BEP) in units and revenue, contribution margin ratio, units required for target profit, margin of safety, and ±10% price sensitivity.',
    url: 'https://solveitcalculator.com/finance/break-even-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Break-Even Calculator (BEP Units, Revenue, Contribution Margin & Margin of Safety) | SolveItCalculator',
    description: 'Calculate your Break-Even Point (BEP) in units and revenue, contribution margin ratio, units required for target profit, margin of safety, and ±10% price sensitivity.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'break-even-calculator',
  slug: 'break-even-calculator',
  name: 'Break-Even Calculator',
  h1: 'Break-Even Point (BEP), Contribution Margin & Target Profit Calculator',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'business',
  subcategoryName: 'Business Finance',
  subcategoryPath: '/finance/business',
  canonicalUrl: 'https://solveitcalculator.com/finance/break-even-calculator',
  shortAnswer:
    'Calculate the exact number of units and gross revenue required to cover your fixed and variable costs (Break-Even Point), plus the sales volume needed to reach your target profit and your Margin of Safety.',
  formula: {
    equation: 'CM = Price − VariableCost ; BEP_{Units} = FixedCosts / CM ; Target_{Units} = (FixedCosts + TargetProfit) / CM',
    description:
      'Cost-Volume-Profit (CVP) analysis divides total fixed overhead by unit contribution margin (Price minus Variable Cost) to find the exact volume where Total Revenue equals Total Cost.',
    variables: [
      { symbol: 'CM', name: 'Unit Contribution Margin', unit: 'USD ($/unit)', description: 'Selling price minus variable cost per unit available to pay down fixed costs.' },
      { symbol: 'BEP_Units', name: 'Break-Even Point in Units', unit: 'Units', description: 'Sales volume where operating profit is exactly $0.' },
      { symbol: 'MoS', name: 'Margin of Safety', unit: '(Actual − BEP) / Actual', description: 'Percentage drop in forecast sales the business can absorb before incurring a loss.' },
    ],
    assumptions: ['Fixed costs remain constant across the relevant production range, and variable cost per unit scales linearly.'],
  },
  workedExample: {
    title: '$24,000 Fixed Costs, $35 Variable Cost, $85 Selling Price ($15k Target Profit)',
    scenario: 'A business with $24,000 in fixed overhead selling a product for $85 that costs $35 to produce.',
    inputs: { 'Fixed Costs': '$24,000', 'Variable Cost / Unit': '$35.00', 'Selling Price / Unit': '$85.00' },
    stepByStep: [
      'Contribution Margin (CM) = $85 − $35 = $50/unit (CM Ratio = 58.82%).',
      'Break-Even Units = $24,000 ÷ $50 = 480 units ($40,800 Break-Even Revenue).',
      'Units for $15,000 Target Profit = ($24,000 + $15,000) ÷ $50 = 780 units ($66,300 Revenue).',
    ],
    finalResult: '480 Break-Even Units ($40,800 Revenue) | 780 Units for $15,000 Profit',
    interpretation: 'A +10% price increase to $93.50 boosts contribution margin to $58.50 and lowers break-even volume from 480 to 411 units.',
  },
  howToUse: [
    'Enter your total fixed costs (rent, salaries, insurance, software).',
    'Enter your variable cost per unit and selling price per unit.',
    'Optionally enter a target profit and expected unit sales to compute required volume and Margin of Safety.',
  ],
  howItIsCalculated: [
    'Computes unit contribution margin CM = Price − Variable Cost and CM Ratio = CM / Price.',
    'Divides Fixed Costs by CM for break-even units and evaluates ±10% pricing scenarios.',
  ],
  whenToUse: ['When launching a new product, signing a commercial lease, or testing a 10% price change.'],
  limitations: ['Multi-product businesses should enter their weighted-average unit price and variable cost.'],
  sourceReference: {
    organization: 'Institute of Management Accountants (IMA) — CVP Standards',
    standardName: 'Cost-Volume-Profit (CVP) & Break-Even Analysis',
    citation: 'Managerial Accounting Standard CVP',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['roi-calculator'],
  relatedConversionPaths: [
    { label: 'Margin Calculator', path: '/finance/margin-calculator' },
    { label: 'Markup Calculator', path: '/finance/markup-calculator' },
    { label: 'Profit Margin Calculator', path: '/finance/profit-margin-calculator' },
  ],
  relatedGuidePaths: [{ title: 'Profit Margin Calculator', path: '/finance/profit-margin-calculator' }],
  faqs: [
    {
      question: 'What is a healthy Margin of Safety percentage?',
      answer: 'A Margin of Safety of 20% to 35% or higher indicates that your forecast sales can drop by 20%–35% before your business slips into an operating loss.',
    },
  ],
};

export default function BreakEvenPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <BreakEvenClient />
    </CalculatorPageSystem>
  );
}
