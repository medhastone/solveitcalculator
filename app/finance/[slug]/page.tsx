import React from 'react';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import MissingFinanceCalculatorsClient, {
  MissingFinanceSlug,
} from '@/components/calculators/MissingFinanceCalculatorsClient';

const FINANCE_CANONICAL_SLUGS: Record<
  Exclude<MissingFinanceSlug, 'margin-and-markup-calculator'>,
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
};

export async function generateStaticParams() {
  return Object.keys(FINANCE_CANONICAL_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'margin-and-markup-calculator') {
    return {
      title: 'Gross Margin Calculator | SolveItCalculator',
      alternates: {
        canonical: 'https://solveitcalculator.com/finance/margin-calculator',
      },
    };
  }
  const meta =
    FINANCE_CANONICAL_SLUGS[
      slug as Exclude<MissingFinanceSlug, 'margin-and-markup-calculator'>
    ];
  if (!meta) {
    return {
      title: 'Finance Calculator | SolveItCalculator',
    };
  }
  const canonicalUrl = `https://solveitcalculator.com/finance/${slug}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function MissingFinanceToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === 'margin-and-markup-calculator') {
    permanentRedirect('/finance/margin-calculator');
  }
  if (!(slug in FINANCE_CANONICAL_SLUGS)) {
    notFound();
  }
  return <MissingFinanceCalculatorsClient slug={slug as MissingFinanceSlug} />;
}
