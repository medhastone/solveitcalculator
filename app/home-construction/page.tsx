import React from 'react';
import type { Metadata } from 'next';
import HomeConstructionHubClient from './HomeConstructionHubClient';
import { HOME_CONSTRUCTION_CATEGORIES, CONSTRUCTION_FAQS } from './homeConstructionCategoryData';

export const metadata: Metadata = {
  title: 'Home & Construction Calculators & Material Takeoff Workbench | SolveItCalculator',
  description:
    'Free construction calculators for concrete slab cubic yards, framing lumber, drywall sheets, roof pitch squares, wall paint gallons, and flooring boxes. Calibrated to IRC building code standards.',
  alternates: {
    canonical: 'https://solveitcalculator.com/home-construction',
  },
  openGraph: {
    title: 'Home & Construction Calculators & Material Takeoff Workbench | SolveItCalculator',
    description:
      'Residential building material estimators for concrete volumes, framing lumber, roofing pitch, flooring boxes, and paint coverage with live waste-factor calculation.',
    url: 'https://solveitcalculator.com/home-construction',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home & Construction Calculators & Takeoff Workbench | SolveItCalculator',
    description: 'Calculate concrete cubic yards, roofing squares, framing studs, and flooring materials with IRC standards.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function HomeConstructionPage() {
  // Flatten all tools across all 10 categories for Schema.org ItemList
  const allTools = HOME_CONSTRUCTION_CATEGORIES.flatMap((c) => c.tools);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/home-construction#collection',
        url: 'https://solveitcalculator.com/home-construction',
        name: 'Home & Construction Calculators',
        description:
          'Comprehensive suite of residential and commercial building material estimators, concrete volume calculators, framing lumber takeoffs, roofing slope squares, and paint coverage engines.',
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
          { '@type': 'ListItem', position: 2, name: 'Home & Construction Calculators', item: 'https://solveitcalculator.com/home-construction' },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Home & Construction Calculators Catalog',
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
        mainEntity: CONSTRUCTION_FAQS.map((faq) => ({
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
      <HomeConstructionHubClient />
    </>
  );
}
