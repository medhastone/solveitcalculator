import React from 'react';
import type { Metadata } from 'next';
import CategoryTopicHub from '@/components/CategoryTopicHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Science Calculators | Physics Kinematics, Ideal Gas & Quantum Energy | SolveItCalculator',
  description:
    'Free scientific calculators for 2D kinematics, projectile motion, Ideal Gas Law (PV=nRT), photon energy, chemical molarity, and radioactive decay. CODATA constants.',
  alternates: {
    canonical: 'https://solveitcalculator.com/science',
  },
  openGraph: {
    title: 'Science Calculators | SolveItCalculator',
    description:
      'Scientific computation engines for classical physics, thermodynamics, photon wave equations, and chemical stoichiometry.',
    url: 'https://solveitcalculator.com/science',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science Calculators | SolveItCalculator',
    description: 'Calculate kinematics, ideal gas equations, and quantum photon energies with CODATA constants.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function SciencePage() {
  const config = getCategoryHubConfig('science');
  if (!config) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/science#collection',
        url: 'https://solveitcalculator.com/science',
        name: 'Science Calculators',
        description: config.intro,
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
          { '@type': 'ListItem', position: 2, name: 'Science Calculators', item: 'https://solveitcalculator.com/science' },
        ],
      },
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryTopicHub config={config} />
    </>
  );
}
