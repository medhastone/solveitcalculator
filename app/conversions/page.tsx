import React from 'react';
import type { Metadata } from 'next';
import ConversionsHubClient from './ConversionsHubClient';
import { CONVERSION_CATEGORIES, CONVERSION_FAQS } from './conversionCategoryData';

export const metadata: Metadata = {
  title: 'Unit Conversion Calculators & Interactive Multi-Unit Workbench | SolveItCalculator',
  description:
    'Free unit converters for length, mass, volume, temperature, speed, energy, pressure, digital data, power, and fuel economy. Verified NIST SP 811 and ISO 80000 conversion factors.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversions',
  },
  openGraph: {
    title: 'Unit Conversion Calculators & Interactive Multi-Unit Workbench | SolveItCalculator',
    description:
      'Standardized unit conversions across length, mass, volume, temperature, and engineering dimensions with live multi-unit broadcast and formula proofs.',
    url: 'https://solveitcalculator.com/conversions',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unit Conversion Calculators & Interactive Workbench | SolveItCalculator',
    description:
      'Convert length, weight, temperature, volume, pressure, and digital data with exact scientific ratios and step-by-step formulas.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function ConversionsPage() {
  // Flatten all tools across all 12 categories for Schema.org ItemList
  const allTools = CONVERSION_CATEGORIES.flatMap((c) => c.tools);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/conversions#collection',
        url: 'https://solveitcalculator.com/conversions',
        name: 'Unit Conversion Calculators',
        description:
          'Scientific-grade unit conversion tools across 12 physical and technical disciplines, featuring live bi-directional multi-unit broadcast and step-by-step formula derivations.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://solveitcalculator.com/#website',
          url: 'https://solveitcalculator.com/',
          name: 'SolveItCalculator',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveitcalculator.com' },
          { '@type': 'ListItem', position: 2, name: 'Unit Conversion Calculators', item: 'https://solveitcalculator.com/conversions' },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Unit Conversion Calculators Catalog',
        numberOfItems: allTools.length,
        itemListElement: allTools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.name,
          description: tool.desc,
          url: tool.path.startsWith('http')
            ? tool.path
            : `https://solveitcalculator.com${tool.path.startsWith('/') ? tool.path : `/${tool.path}`}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: CONVERSION_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ConversionsHubClient />
    </>
  );
}
