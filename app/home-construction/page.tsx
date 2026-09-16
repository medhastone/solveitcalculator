import React from 'react';
import { Metadata } from 'next';
import HomeConstructionClient from './HomeConstructionClient';

export const metadata: Metadata = {
  title: 'Home & Construction Calculators – Flooring, Concrete, Paint, Roofing & More | SolveItCalculator',
  description: 'Use free home and construction calculators for flooring, concrete, paint, roofing, tile, drywall, landscaping, materials, renovation costs, and building projects.',
  keywords: [
    'Home Construction Calculators',
    'Construction Calculators',
    'Home Improvement Calculators',
    'Concrete Calculator',
    'Paint Calculator',
    'Flooring Calculator',
    'Roofing Calculator',
    'Tile Calculator',
    'Drywall Calculator',
    'Landscaping Calculator',
    'Material Calculator',
    'Deck Calculator',
    'Fence Calculator',
    'Renovation Cost Calculator',
    'Building Material Calculator',
    'Construction Cost Estimator',
    'home construction calculators',
    'construction calculator',
    'building material calculator',
    'renovation calculator',
    'home improvement calculator',
    'free construction tools'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/home-construction-calculators/',
  },
  openGraph: {
    title: 'Home & Construction Calculators | Free Building & Renovation Tools',
    description: 'Estimate concrete, paint, flooring, roofing, drywall, landscaping materials, renovation costs, and more with free calculators from SolveItCalculator.',
    url: 'https://solveitcalculator.com/home-construction-calculators/',
    siteName: 'SolveItCalculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home & Construction Calculators | Free Building & Renovation Tools',
    description: 'Calculate building materials, project costs, flooring, roofing, paint, concrete, and renovation estimates with free online calculators.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/home-construction-calculators/',
      url: 'https://solveitcalculator.com/home-construction-calculators/',
      name: 'Home & Construction Calculators – Flooring, Concrete, Paint, Roofing & More | SolveItCalculator',
      description: 'Use free home and construction calculators for flooring, concrete, paint, roofing, tile, drywall, landscaping, materials, renovation costs, and building projects.',
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://solveitcalculator.com/#website',
        url: 'https://solveitcalculator.com/',
        name: 'SolveItCalculator',
      },
      about: {
        '@type': 'Thing',
        name: 'Home Construction Calculators',
        description: 'Find free Home & Construction Calculators for concrete, paint, flooring, roofing, drywall, landscaping, renovation costs, building materials, and home improvement projects. Fast, accurate, and easy-to-use tools for professionals and homeowners.',
      },
      breadcrumb: {
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
            name: 'Home & Construction Calculators',
            item: 'https://solveitcalculator.com/home-construction-calculators/',
          },
        ],
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'SolveIt Home & Construction Calculators & Estimating Platform',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Why do construction calculators include a 10% waste buffer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In physical trades like concrete pours, masonry, and lumber framing, physical conditions never match theoretical models. Sub-grade unevenness, formwork bowing, scrap cutoffs, and edge trimming require an allowance of ~10% to prevent running out of material mid-project.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are these calculators calibrated against local building codes (IBC / IRC)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Baseline formulas incorporate standards from the International Building Code (IBC 2024), International Residential Code (IRC), ASTM C94 (Ready-Mixed Concrete), and ACI 318 (Structural Concrete).',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I calculate both Imperial (feet/inches) and Metric (meters/mm)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. SolveIt calculation engines support unit toggling with double-precision 64-bit IEEE 754 float precision whether calculating in cubic yards, square feet, square meters, or metric tonnes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does SolveIt save project takeoff data on cloud servers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Calculation engines execute client-side in your browser sandbox, keeping your dimensions, takeoff tallies, and material schedules completely private to your device.',
          },
        },
      ],
    },
  ],
};

export default function HomeConstructionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeConstructionClient />
    </>
  );
}
