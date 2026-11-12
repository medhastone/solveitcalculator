import type { Metadata } from 'next';
import FinanceCategoryPageClient from '@/components/finance-suite/FinanceCategoryPageClient';

export const metadata: Metadata = {
  title: 'Finance Calculators: Loans, Tax, Salary & 401(k) | SolveIt',
  description:
    'Choose the right financial calculator for mortgages, personal loans, gross-to-net salary, US and global income taxes, 401(k) retirement match, and profit margin.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance',
  },
  openGraph: {
    title: 'Finance Calculators: Loans, Tax, Salary & 401(k) | SolveIt',
    description:
      'Calculate gross-to-net salary, federal and statutory payroll taxes, mortgage amortization, compound interest, and retirement projections.',
    url: 'https://solveitcalculator.com/finance',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finance Calculators: Loans, Tax, Salary & 401(k) | SolveIt',
    description:
      'Calculate gross-to-net salary, federal and statutory payroll taxes, mortgage amortization, compound interest, and retirement projections.',
  },
};

export default function FinanceCategoryPage() {
  return <FinanceCategoryPageClient />;
}
