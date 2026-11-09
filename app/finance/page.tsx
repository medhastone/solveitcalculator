import type { Metadata } from 'next';
import FinanceCategoryPageClient from '@/components/finance-suite/FinanceCategoryPageClient';

export const metadata: Metadata = {
  title:
    'Finance, Tax & Salary Calculators — Mortgage, Loans, Take-Home Pay & Retirement | SolveItCalculator',
  description:
    'Free financial, tax, and retirement calculators: estimate country-specific salary and take-home pay (US, UK, Canada, Australia, India), mortgage payments, loan amortization, compound interest, 401(k)/RMD, and profit margins.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance',
  },
  openGraph: {
    title:
      'Finance, Tax & Salary Calculators — Net Pay, Mortgage, Loans & Investing | SolveItCalculator',
    description:
      'Calculate gross-to-net salary, federal and statutory payroll taxes, mortgage amortization, compound interest, and retirement projections.',
    url: 'https://solveitcalculator.com/finance',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Finance, Tax & Salary Calculators — Net Pay, Mortgage, Loans & Investing | SolveItCalculator',
    description:
      'Calculate gross-to-net salary, federal and statutory payroll taxes, mortgage amortization, compound interest, and retirement projections.',
  },
};

export default function FinanceCategoryPage() {
  return <FinanceCategoryPageClient />;
}
