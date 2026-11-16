import type { Metadata } from 'next';
import GuidesHubClient from '@/components/guides/GuidesHubClient';

export const metadata: Metadata = {
  title: 'Educational Guides & Formula Tutorials | SolveItCalculator',
  description:
    'Plain-English educational guides explaining math, percentage, finance, home project, and tax formulas step by step with worked examples.',
  alternates: {
    canonical: 'https://solveitcalculator.com/guides',
  },
  openGraph: {
    title: 'Educational Guides & Formula Tutorials | SolveItCalculator',
    description:
      'Step-by-step calculation guides, formulas, worked examples, and reference tables across Math, Finance, Home, and Retirement & Tax.',
    url: 'https://solveitcalculator.com/guides',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Educational Guides & Formula Tutorials | SolveItCalculator',
    description:
      'Step-by-step calculation guides, formulas, worked examples, and reference tables across Math, Finance, Home, and Retirement & Tax.',
  },
};

const GUIDES_HUB_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/guides#collection',
      url: 'https://solveitcalculator.com/guides',
      name: 'Educational Guides & Formula Tutorials | SolveItCalculator',
      description:
        'Plain-English educational guides explaining math, percentage, finance, home project, and tax formulas step by step with worked examples.',
      isPartOf: {
        '@id': 'https://solveitcalculator.com/#website',
      },
      dateModified: '2026-11-16',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/guides#breadcrumb',
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
          name: 'Guides',
          item: 'https://solveitcalculator.com/guides',
        },
      ],
    },
  ],
};

export default function GuidesHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(GUIDES_HUB_JSON_LD) }}
      />
      <GuidesHubClient />
    </>
  );
}
