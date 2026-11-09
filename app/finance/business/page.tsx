import type { Metadata } from 'next';
import BusinessCategoryPageClient from '@/components/finance-suite/BusinessCategoryPageClient';

export const metadata: Metadata = {
  title:
    'Business & Pricing Calculators — Gross Margin, Markup, Break-Even & 1099 Tax | SolveItCalculator',
  description:
    'Free business and pricing calculators: compute gross margin, markup percentage, net operating profit margin, break-even units and revenue, and 1099 vs. W-2 contractor taxes.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/business',
  },
  openGraph: {
    title:
      'Business & Pricing Calculators — Margin, Markup & Break-Even | SolveItCalculator',
    description:
      'Calculate gross profit margin, markup percentage, break-even volume, and self-employment taxes with step-by-step formulas.',
    url: 'https://solveitcalculator.com/finance/business',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Business & Pricing Calculators — Margin, Markup & Break-Even | SolveItCalculator',
    description:
      'Calculate gross profit margin, markup percentage, break-even volume, and self-employment taxes with step-by-step formulas.',
  },
};

export default function BusinessCategoryPage() {
  return <BusinessCategoryPageClient />;
}
