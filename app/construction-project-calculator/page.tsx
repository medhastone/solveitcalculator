import type { Metadata } from 'next';
import ConstructionProjectCalculatorClient from '@/components/calculators/ConstructionProjectCalculatorClient';
import ServerCalculatorReferenceSection from '@/components/calculator-page/ServerCalculatorReferenceSection';
import CalculatorInternalLinksBand from '@/components/calculator-page/CalculatorInternalLinksBand';

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
  twitter: {
    card: 'summary_large_image',
    title: 'Concrete Slab, Cubic Yard & Fence Post Calculator | SolveIt',
    description: 'Estimate cubic yards of concrete for slabs (including 1,000 sq ft slabs), gravel cubic yard to ton conversions, fence post holes, and flooring materials.',
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
      <ServerCalculatorReferenceSection
        title="Construction Project Calculator"
        formulaHeading="Concrete Slab & Material Volume Formula Explanation"
        formulaExpression="Cubic Yards = (Length_ft × Width_ft × Thickness_in ÷ 12) ÷ 27  |  Order Volume = Cubic Yards × (1 + Waste%)"
        formulaExplanation="Convert slab thickness from inches to feet by dividing by 12, multiply by length and width to get cubic feet, and divide by 27 (since 1 cubic yard equals 27 cubic feet). Add 5% to 10% extra volume to cover subgrade unevenness and chute spillage."
        exampleHeading="Worked Concrete Slab Example"
        exampleSummary="Example: Pouring a 20 ft × 50 ft (1,000 sq ft) garage concrete slab at 4 inches thick with 10% waste."
        exampleSteps={[
          'Convert thickness to feet: 4 in ÷ 12 = 0.3333 ft.',
          'Calculate net volume in cubic yards: (20 × 50 × 0.3333) ÷ 27 = 12.35 cubic yards.',
          'Add 10% waste allowance: 12.35 × 1.10 = 13.58 cubic yards (order 14 yd³ ready-mix).',
        ]}
      />
      <CalculatorInternalLinksBand calculatorPath="/construction-project-calculator" />
    </>
  );
}
