import type { Metadata } from 'next';
import AboutMethodologyClient from '@/components/about/AboutMethodologyClient';

export const metadata: Metadata = {
  title: 'Calculation Methodology, Formulas & Change Log | SolveItCalculator',
  description:
    'Formulas, IEEE 754 rounding rules, default assumptions, category testing procedures, and visible change log for SolveItCalculator tools.',
  alternates: {
    canonical: 'https://solveitcalculator.com/calculation-methodology',
  },
  openGraph: {
    title: 'Calculation Methodology, Formulas & Change Log | SolveItCalculator',
    description:
      'Formulas, rounding rules, default assumptions, category testing procedures, and change log on SolveItCalculator.com.',
    url: 'https://solveitcalculator.com/calculation-methodology',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculation Methodology, Formulas & Change Log | SolveItCalculator',
    description:
      'Formulas, rounding rules, default assumptions, category testing procedures, and change log on SolveItCalculator.com.',
  },
};

const METHODOLOGY_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://solveitcalculator.com/calculation-methodology#webpage',
      url: 'https://solveitcalculator.com/calculation-methodology',
      name: 'Calculation Methodology, Formulas & Change Log | SolveItCalculator',
      description:
        'Formulas, IEEE 754 rounding rules, default assumptions, category testing procedures, and visible change log for SolveItCalculator tools.',
      dateModified: '2026-11-16',
      isPartOf: {
        '@id': 'https://solveitcalculator.com/#website',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/calculation-methodology#breadcrumb',
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
          name: 'Calculation Methodology',
          item: 'https://solveitcalculator.com/calculation-methodology',
        },
      ],
    },
  ],
};

export default function CalculationMethodologyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(METHODOLOGY_JSON_LD) }}
      />
      <AboutMethodologyClient pageVariant="methodology" />
    </>
  );
}
