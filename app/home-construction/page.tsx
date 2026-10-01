import type { Metadata } from 'next';
import HomeConstructionClient from './HomeConstructionClient';

export const metadata: Metadata = {
  title: 'Home & Construction Calculators | Concrete, Roofing & More | SolveItCalculator',
  description:
    'Use free home and construction calculators for concrete, roofing, flooring, paint, drywall, lumber, decks, fencing, landscaping, area, materials, and project estimates.',
  alternates: {
    canonical: 'https://solveitcalculator.com/home-construction/',
  },
  openGraph: {
    title: 'Home & Construction Calculators | SolveItCalculator',
    description:
      'Plan, Measure & Estimate Your Next Project. Free trade calculators for concrete, framing, roofing, paint, drywall, siding, decks, and landscaping.',
    url: 'https://solveitcalculator.com/home-construction/',
    siteName: 'SolveItCalculator',
    type: 'website',
  },
};

export default function HomeConstructionPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SolveItCalculator - Home & Construction Calculators',
    url: 'https://solveitcalculator.com/home-construction/',
    description:
      'Comprehensive suite of home improvement and construction trade calculators for concrete, roofing, drywall, paint, framing lumber, deck boards, fences, and landscaping.',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

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
