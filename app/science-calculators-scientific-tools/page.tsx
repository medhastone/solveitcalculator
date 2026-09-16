import React from 'react';
import { Metadata } from 'next';
import ScienceClient from '../science/ScienceClient';

export const metadata: Metadata = {
  title: 'Science Calculators & Scientific Tools – Physics, Chemistry, Biology & More | SolveItCalculator',
  description: 'Use free science calculators for physics, chemistry, biology, astronomy, engineering, formulas, scientific conversions, and advanced calculations.',
  keywords: [
    'science calculators',
    'scientific tools',
    'physics calculator',
    'chemistry calculator',
    'biology calculator',
    'engineering calculator',
    'astronomy calculator',
    'scientific formula calculator',
    'molarity calculator',
    'density calculator',
    'scientific conversion calculator',
    'laboratory calculator',
    'free scientific calculators',
    'velocity calculator',
    'force calculator',
    'pressure calculator',
    'energy calculator',
    'scientific tools online'
  ],
  alternates: {
    canonical: '/science-calculators-scientific-tools/',
  },
  openGraph: {
    type: 'website',
    title: 'Science Calculators & Scientific Tools | Free Physics & Chemistry Calculators',
    description: 'Calculate scientific formulas, physics equations, chemistry reactions, biology metrics, engineering values, and more with free tools from SolveItCalculator.',
    url: '/science-calculators-scientific-tools/',
    siteName: 'SolveItCalculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Science Calculators & Scientific Tools | Free Scientific Calculation Tools',
    description: 'Free science calculators for physics, chemistry, biology, engineering, astronomy, formulas, and scientific conversions.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Science Calculators & Scientific Tools',
  url: 'https://solveitcalculator.com/science-calculators-scientific-tools/',
  description: 'Use free science calculators for physics, chemistry, biology, astronomy, engineering, formulas, scientific conversions, and advanced calculations.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Physics Calculators',
    'Chemistry Calculators',
    'Biology Calculators',
    'Engineering Calculators',
    'Astronomy Calculators',
    'Laboratory Calculators',
    'Scientific Formula Calculators',
    'Density Calculators',
    'Molarity Calculators',
    'Force & Motion Calculators',
    'Energy Calculators',
    'Pressure Calculators',
    'Scientific Conversion Tools',
    'Research & Academic Calculators',
  ],
};

export default function ScienceCalculatorsScientificToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScienceClient />
    </>
  );
}
