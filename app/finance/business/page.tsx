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

const BUSINESS_HUB_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/finance/business#collection',
      url: 'https://solveitcalculator.com/finance/business',
      name: 'Business Calculators: Margin, Markup, Break-Even | SolveItCalculator',
      description:
        'Calculate gross margin, retail markup, net and operating profit margin, break-even unit volume, promotional discounts, and 1099 self-employment taxes.',
      isPartOf: {
        '@id': 'https://solveitcalculator.com/#website',
      },
      dateModified: '2026-11-16',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/finance/business#breadcrumb',
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
          name: 'Business Calculators',
          item: 'https://solveitcalculator.com/finance/business',
        },
      ],
    },
  ],
};

export default function BusinessCategoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS_HUB_JSON_LD) }}
      />
      <BusinessCategoryPageClient />
    </>
  );
}
