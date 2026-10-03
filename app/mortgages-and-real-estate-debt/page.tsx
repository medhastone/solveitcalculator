import { Metadata } from 'next';
import MortgagesAndRealEstateDebtClient from './MortgagesAndRealEstateDebtClient';

export const metadata: Metadata = {
  title: 'Mortgages & Real Estate Debt Calculators – SolveIt Calculator',
  description:
    'Calculate mortgage payments, PITI costs, PMI expenses, ARM scenarios, refinancing savings, affordability limits, home equity growth, and real estate financing costs with advanced, user-friendly mortgage calculators.',
  keywords: [
    'mortgage calculator',
    'PITI calculator',
    'home loan calculator',
    'refinance calculator',
    'PMI calculator',
    '15 vs 30 year mortgage',
    'ARM loan calculator',
    'home affordability calculator',
    'HELOC calculator',
    'rental property calculator',
    'amortization schedule',
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/mortgages-and-real-estate-debt',
  },
  openGraph: {
    title: 'Mortgages & Real Estate Debt Calculators – SolveIt Calculator',
    description:
      'Calculate mortgage payments, PITI costs, PMI expenses, ARM scenarios, refinancing savings, affordability limits, and home equity growth with instant, verified client-side calculators.',
    url: 'https://solveitcalculator.com/mortgages-and-real-estate-debt',
    siteName: 'SolveIt Calculator',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
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
          name: 'Finance',
          item: 'https://solveitcalculator.com/finance',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Mortgage & Real Estate Debt Hub',
          item: 'https://solveitcalculator.com/mortgages-and-real-estate-debt',
        },
      ],
    },
    {
      '@type': 'CollectionPage',
      name: 'Mortgage & Real Estate Debt Calculators',
      description:
        'Comprehensive suite of mortgage calculators covering fixed-rate loans, PITI, amortization, refinance, affordability, and real estate debt.',
      url: 'https://solveitcalculator.com/mortgages-and-real-estate-debt',
    },
  ],
};

export default function MortgagesAndRealEstateDebtPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MortgagesAndRealEstateDebtClient />
    </>
  );
}
