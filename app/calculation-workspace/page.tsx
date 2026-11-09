import type { Metadata } from 'next';
import CalculationWorkspaceClient from '@/components/calculators/CalculationWorkspaceClient';

export const metadata: Metadata = {
  title: 'Calculation Workspace — Multi-Step Expression & History Calculator | SolveItCalculator',
  description:
    'Calculate, review previous steps, and reuse results without starting over. Free online calculation workspace with live expression preview, running totals, named subtotals, and local history export.',
  alternates: {
    canonical: 'https://solveitcalculator.com/calculation-workspace',
  },
  openGraph: {
    title: 'Calculation Workspace | SolveItCalculator',
    description:
      'Calculate, review previous steps, and reuse results without starting over.',
    url: 'https://solveitcalculator.com/calculation-workspace',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculation Workspace — Multi-Step Expression & History Calculator | SolveItCalculator',
    description: 'Calculate, review previous steps, and reuse results without starting over. Free online calculation workspace with live expression preview, running totals, named subtotals, and local history export.',
  },
};

export default function CalculationWorkspacePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Calculation Workspace — Multi-Step Expression & History Calculator',
        url: 'https://solveitcalculator.com/calculation-workspace',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        description:
          'Calculate multi-step expressions, review previous steps, maintain running totals, label subtotals, and reuse results locally without starting over.',
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
            name: 'Math Calculators',
            item: 'https://solveitcalculator.com/math',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Calculation Workspace',
            item: 'https://solveitcalculator.com/calculation-workspace',
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
      <CalculationWorkspaceClient />
    </>
  );
}
