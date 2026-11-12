import type { Metadata } from 'next';
import BusinessCategoryPageClient from '@/components/finance-suite/BusinessCategoryPageClient';

export const metadata: Metadata = {
  title: 'Business Calculators: Margin, Markup, Break-Even | SolveIt',
  description:
    'Calculate gross margin, retail markup, net and operating profit margin, break-even unit volume, promotional discounts, and 1099 self-employment taxes.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/business',
  },
  openGraph: {
    title: 'Business Calculators: Margin, Markup, Break-Even | SolveIt',
    description:
      'Calculate gross margin, markup, net profit margin, break-even volume, and 1099 contractor taxes.',
    url: 'https://solveitcalculator.com/finance/business',
    type: 'website',
  },
};

export default function BusinessCategoryPage() {
  return <BusinessCategoryPageClient />;
}
