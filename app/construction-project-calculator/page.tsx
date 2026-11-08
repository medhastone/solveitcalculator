import type { Metadata } from 'next';
import ConstructionProjectCalculatorClient from '@/components/calculators/ConstructionProjectCalculatorClient';

export const metadata: Metadata = {
  title:
    'Concrete Slab, Cubic Yard & Fence Post Calculator | SolveIt',
  description:
    'Estimate cubic yards of concrete for slabs (including 1,000 sq ft slabs), gravel cubic yard to ton conversions, fence post holes, and flooring materials.',
  alternates: {
    canonical: 'https://solveitcalculator.com/construction-project-calculator',
  },
  openGraph: {
    title: 'Concrete Slab, Cubic Yard & Fence Post Calculator | SolveIt',
    description:
      'Estimate cubic yards of concrete for slabs (including 1,000 sq ft slabs), gravel cubic yard to ton conversions, fence post holes, and flooring materials.',
    url: 'https://solveitcalculator.com/construction-project-calculator',
    type: 'website',
  },
};

export default function ConstructionProjectCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Construction Project Calculator',
        url: 'https://solveitcalculator.com/construction-project-calculator',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        description:
          'Guided 4-stage construction calculator workflow (Measurements → Quantity → Waste allowance → Estimated cost) for rectangular areas, concrete slabs, and cylindrical post holes.',
      },
      {
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
            name: 'Home & Construction',
            item: 'https://solveitcalculator.com/home-construction',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Construction Project Calculator',
            item: 'https://solveitcalculator.com/construction-project-calculator',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ConstructionProjectCalculatorClient />
    </>
  );
}
