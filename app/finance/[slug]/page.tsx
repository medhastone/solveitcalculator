import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MissingFinanceCalculatorsClient, {
  MissingFinanceSlug,
} from '@/components/calculators/MissingFinanceCalculatorsClient';

const FINANCE_FALLBACK_SLUGS: Record<
  MissingFinanceSlug,
  { title: string; description: string }
> = {
  'safe-withdrawal-rate-calculator': {
    title: 'Safe Withdrawal Rate (4% Rule) Calculator | SolveItCalculator',
    description:
      'Simulate retirement portfolio longevity across 20 to 40 years using the 4% Safe Withdrawal Rate rule with inflation adjustment.',
  },
  'investment-growth-calculator': {
    title: 'Investment Growth & Expense Ratio Drag Calculator | SolveItCalculator',
    description:
      'Project long-term retirement portfolio value and measure how annual fund expense ratios impact your final nest egg.',
  },
  'real-rate-of-return-calculator': {
    title: 'Real Rate of Return (Inflation-Adjusted) Calculator | SolveItCalculator',
    description:
      'Calculate your true purchasing-power growth rate after accounting for inflation using the exact Fisher equation.',
  },
  'home-affordability-calculator': {
    title: 'Home Affordability Calculator (28/36 Rule) | SolveItCalculator',
    description:
      'Calculate the maximum house price you can comfortably afford based on gross income, down payment, and monthly debts.',
  },
  'refinance-calculator': {
    title: 'Mortgage Refinance & Break-Even Calculator | SolveItCalculator',
    description:
      'Compare your current mortgage against a new loan rate and closing costs to find your exact break-even month.',
  },
  'rent-vs-buy-calculator': {
    title: 'Rent vs. Buy Home Comparison Calculator | SolveItCalculator',
    description:
      'Compare the long-term net cost of renting versus buying a home including appreciation, maintenance, and equity.',
  },
  'margin-and-markup-calculator': {
    title: 'Margin & Markup Calculator — Gross Profit & Selling Price | SolveItCalculator',
    description:
      'Compute gross profit margin, markup percentage, revenue, and unit profit side by side.',
  },
};

export async function generateStaticParams() {
  return Object.keys(FINANCE_FALLBACK_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = FINANCE_FALLBACK_SLUGS[slug as MissingFinanceSlug];
  if (!meta) {
    return {
      title: 'Finance Calculator | SolveItCalculator',
    };
  }
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://solveitcalculator.com/finance/${slug}`,
    },
  };
}

export default async function MissingFinanceToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in FINANCE_FALLBACK_SLUGS)) {
    notFound();
  }
  return <MissingFinanceCalculatorsClient slug={slug as MissingFinanceSlug} />;
}
