import React from 'react';
import { Metadata } from 'next';
import TechnologyClient from './TechnologyClient';

export const metadata: Metadata = {
  title: 'Technology Calculators & Developer Tools | SolveIt Calculator',
  description: '100+ free, deterministic networking calculators, cloud cost estimators, cryptographic tools, and infrastructure sizing workbenches. Computed 100% in-browser with zero telemetry.',
};

export default function TechnologyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
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
        name: 'Technology Calculators & Developer Tools',
        item: 'https://solveitcalculator.com/technology',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TechnologyClient />
    </>
  );
}
