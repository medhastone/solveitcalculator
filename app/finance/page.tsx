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

const FINANCE_HUB_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/finance#collection',
      url: 'https://solveitcalculator.com/finance',
      name: 'Finance Calculators: Loans, Tax, Salary & 401(k) | SolveItCalculator',
      description:
        'Choose the right financial calculator for mortgages, personal loans, gross-to-net salary, US and global income taxes, 401(k) retirement match, and profit margin.',
      isPartOf: {
        '@id': 'https://solveitcalculator.com/#website',
      },
      dateModified: '2026-11-16',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/finance#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://solveitcalculator.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Finance Calculators',
          item: 'https://solveitcalculator.com/finance',
        },
      ],
    },
  ],
};

export default function FinanceCategoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FINANCE_HUB_JSON_LD) }}
      />
      <FinanceCategoryPageClient />
    </>
  );
}
