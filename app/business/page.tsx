import React from 'react';
import type { Metadata } from 'next';
import BusinessHubClient from './BusinessHubClient';
import { BUSINESS_CATEGORIES, BUSINESS_FAQS } from './businessCategoryData';

export const metadata: Metadata = {
  title: 'Business Calculators | Profit Margins, Break-Even, SaaS Metrics & ROI',
  description:
    'Free, institutional-grade business calculators for profit margins, markups, break-even unit sales, SaaS LTV:CAC ratios, cash runway burn rates, and DuPont ROE analysis.',
  alternates: {
    canonical: 'https://solveitcalculator.com/business',
  },
  openGraph: {
    title: 'Business Calculators & Multi-Metric Analytics Hub | SolveItCalculator',
    description:
      'Managerial finance, gross margin vs markup solvers, SaaS unit economics, startup runway forecasters, and 50+ business calculators.',
    url: 'https://solveitcalculator.com/business',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Calculators | SolveItCalculator',
    description: 'Calculate profit margins, break-even points, SaaS LTV:CAC, and cash runway with free financial tools.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function BusinessPage() {
  // Flatten all tools across all 8 categories for Schema.org ItemList indexing
  const allTools = BUSINESS_CATEGORIES.flatMap((c) => c.tools);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/business#collection',
        url: 'https://solveitcalculator.com/business',
        name: 'Business Calculators & Live Multi-Metric Analytics Hub',
        description:
          'Comprehensive suite of business and managerial finance calculation tools, featuring interactive solvers for profit margin vs markup, break-even CVP analysis, SaaS unit economics, cash runway burn rate, and corporate financial ratios.',
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
          { '@type': 'ListItem', position: 2, name: 'Business Calculators', item: 'https://solveitcalculator.com/business' },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': 'https://solveitcalculator.com/business#itemlist',
        name: 'Business Calculation Tools Directory',
        numberOfItems: allTools.length,
        itemListElement: allTools.map((tool, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: tool.name,
          description: tool.description,
          url: `https://solveitcalculator.com${tool.href}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: BUSINESS_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
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
      <BusinessHubClient />
    </>
  );
}
