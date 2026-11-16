import React from 'react';
import type { Metadata } from 'next';
import AllCalculatorsDirectoryClient from '@/components/directory/AllCalculatorsDirectoryClient';

export const metadata: Metadata = {
  title: 'All Calculators Directory: Math, Finance & Units | SolveIt',
  description:
    'Browse 91 verified online calculators grouped by category across Math, Finance & Tax, Unit Conversion, Date & Time, Health & Fitness, Construction, and Science.',
  alternates: {
    canonical: 'https://solveitcalculator.com/calculators',
  },
  openGraph: {
    title: 'All Calculators Directory: Math, Finance & Units | SolveIt',
    description:
      'Explore all verified calculators grouped by category with step-by-step equations, worked examples, and instant browser calculations.',
    url: 'https://solveitcalculator.com/calculators',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Calculators Directory: Math, Finance & Units | SolveIt',
    description:
      'Browse 91 verified online calculators grouped by category across Math, Finance & Tax, Unit Conversion, Date & Time, Health & Fitness, Construction, and Science.',
  },
};

const CALCULATORS_DIRECTORY_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/calculators#collection',
      url: 'https://solveitcalculator.com/calculators',
      name: 'All Calculators Directory: Math, Finance & Units | SolveItCalculator',
      description:
        'Browse 91 verified online calculators grouped by category across Math, Finance & Tax, Unit Conversion, Date & Time, Health & Fitness, Construction, and Science.',
      isPartOf: {
        '@id': 'https://solveitcalculator.com/#website',
      },
      dateModified: '2026-11-16',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/calculators#breadcrumb',
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
          name: 'All Calculators',
          item: 'https://solveitcalculator.com/calculators',
        },
      ],
    },
  ],
};

export default function AllCalculatorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CALCULATORS_DIRECTORY_JSON_LD) }}
      />
      <AllCalculatorsDirectoryClient />
    </>
  );
}
