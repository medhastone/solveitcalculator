import type { Metadata } from 'next';
import SalaryCalculatorClient from '@/components/calculators/SalaryCalculatorClient';

export const metadata: Metadata = {
  title:
    'Salary & Take-Home Pay Calculator (US, UK, Canada, Australia, India) | SolveIt Calculator',
  description:
    'Estimate your net take-home pay across the United States, United Kingdom, Canada, Australia, and India using official tax brackets, statutory deductions, and transparent assumptions.',
  alternates: {
    canonical: 'https://solveitcalculator.com/salary-calculator',
  },
  openGraph: {
    title:
      'Country-Specific Salary & Take-Home Pay Calculator | SolveIt Calculator',
    description:
      'Calculate gross-to-net salary, progressive income tax brackets, statutory social contributions (FICA, NI, CPP/EI, Medicare Levy, Cess), and effective vs. marginal tax rates.',
    url: 'https://solveitcalculator.com/salary-calculator',
    type: 'website',
  },
};

export default function SalaryCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Country-Specific Salary & Take-Home Pay Calculator',
        url: 'https://solveitcalculator.com/salary-calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        description:
          'Estimate gross-to-net salary and take-home pay for the United States, United Kingdom, Canada, Australia, and India with transparent statutory tax rules and official source references.',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://solveitcalculator.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Finance Calculators',
            item: 'https://solveitcalculator.com/finance',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Salary & Take-Home Pay Calculator',
            item: 'https://solveitcalculator.com/salary-calculator',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SalaryCalculatorClient />
    </>
  );
}
