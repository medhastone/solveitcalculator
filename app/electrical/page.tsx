import React from 'react';
import type { Metadata } from 'next';
import ElectricalCategoryHub from '@/components/ElectricalCategoryHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Electrical Calculators | Wire Sizing, Voltage Drop & Electricity Costs | SolveItCalculator',
  description:
    'Free electrical calculators for wire gauge sizing (AWG), voltage drop, electricity bills, Ohm’s Law, power wattage, and circuit breaker ratings. 24+ free electrical solvers.',
  alternates: {
    canonical: 'https://solveitcalculator.com/electrical',
  },
  openGraph: {
    title: 'Electrical Calculators | Wire Sizing, Voltage Drop & Power Tools | SolveItCalculator',
    description:
      'National Electrical Code (NEC / NFPA 70) compliant calculation models for wire size, voltage drop, breaker ratings, electricity bills, and power formulas.',
    url: 'https://solveitcalculator.com/electrical',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electrical Calculators | SolveItCalculator',
    description: 'Calculate wire sizing, voltage drop, and electrical loads with NEC-standard tools.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function ElectricalPage() {
  const config = getCategoryHubConfig('electrical');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/electrical#collection',
        url: 'https://solveitcalculator.com/electrical',
        name: 'Electrical Calculators & Sizing Tools',
        description: config?.intro || 'Free electrical calculators for wire sizing, voltage drop, and power calculations.',
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
          { '@type': 'ListItem', position: 2, name: 'Electrical Calculators', item: 'https://solveitcalculator.com/electrical' },
        ],
      },
      ...(config?.faqs
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: config.faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ElectricalCategoryHub />
    </>
  );
}
