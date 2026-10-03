import React from 'react';
import type { Metadata } from 'next';
import SalaryAndPayrollClient from '@/app/salary-and-payroll/SalaryAndPayrollClient';

export const metadata: Metadata = {
  title: 'Salary & Payroll Calculators | Gross to Net Pay & Hourly Wage Conversions',
  description:
    'Convert hourly wages, daily shift pay, weekly compensation, and annual salaries. Estimate take-home pay after statutory withholdings and deductions.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/salary',
  },
  openGraph: {
    title: 'Salary & Payroll Calculators – SolveIt Calculator',
    description:
      'Convert between hourly, daily, and annual salaries with net take-home estimations.',
    url: 'https://solveitcalculator.com/finance/salary',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveitcalculator.com' },
        { '@type': 'ListItem', position: 2, name: 'Finance', item: 'https://solveitcalculator.com/finance' },
        { '@type': 'ListItem', position: 3, name: 'Salary & Payroll', item: 'https://solveitcalculator.com/finance/salary' },
      ],
    },
    {
      '@type': 'CollectionPage',
      name: 'Salary & Payroll Calculators',
      url: 'https://solveitcalculator.com/finance/salary',
      description: 'Calculators for converting hourly rates to annual salaries, shift compensation, and gross-to-net pay estimations.',
    },
  ],
};

export default function SalarySubcategoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SalaryAndPayrollClient />
    </>
  );
}
