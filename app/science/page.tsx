import React from 'react';
import type { Metadata } from 'next';
import ScienceHubClient from './ScienceHubClient';
import { SCIENCE_CATEGORIES, SCIENCE_FAQS } from './scienceCategoryData';

export const metadata: Metadata = {
  title: 'Science Calculators | Physics Kinematics, Ideal Gas & Quantum Energy',
  description:
    'Free scientific calculators for 2D kinematics, projectile motion, Ideal Gas Law (PV=nRT), photon energy, chemical molarity, and orbital velocity. CODATA constants.',
  alternates: {
    canonical: 'https://solveitcalculator.com/science',
  },
  openGraph: {
    title: 'Science Calculators & Physics Workbench | SolveItCalculator',
    description:
      'Scientific computation engines for classical mechanics, thermodynamics, quantum photon waves, stoichiometry, and orbital mechanics.',
    url: 'https://solveitcalculator.com/science',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science Calculators | SolveItCalculator',
    description: 'Calculate kinematics, ideal gas equations, molar masses, and quantum photon energies with CODATA constants.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function SciencePage() {
  const allTools = SCIENCE_CATEGORIES.flatMap((c) => c.tools);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/science#collection',
        url: 'https://solveitcalculator.com/science',
        name: 'Science Calculators & Interactive Multi-Discipline Workbench',
        description:
          'Comprehensive suite of scientific calculation tools, featuring interactive solvers for 2D projectile kinematics, Ideal Gas Law thermodynamics, molar mass and stoichiometry, orbital velocity and celestial mechanics, and quantum photon energy.',
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
        '@type': 'ItemList',
        '@id': 'https://solveitcalculator.com/science#itemlist',
        name: 'Scientific Calculation Tools Directory',
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
        mainEntity: SCIENCE_FAQS.map((faq) => ({
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
      <ScienceHubClient />
    </>
  );
}
