import type { Metadata } from 'next';
import FlooringProjectCalculatorClient from '@/components/calculators/FlooringProjectCalculatorClient';
import ServerCalculatorReferenceSection from '@/components/calculator-page/ServerCalculatorReferenceSection';
import CalculatorInternalLinksBand from '@/components/calculator-page/CalculatorInternalLinksBand';

export const metadata: Metadata = {
  title: 'Flooring & Vinyl Plank Calculator (sq ft & Boxes) | SolveIt',
  description:
    'Estimate room square footage, vinyl plank or hardwood box counts, linear feet to square feet coverage, waste allowance, and material cost in 3 steps.',
  alternates: {
    canonical: 'https://solveitcalculator.com/home-construction/flooring-calculator',
  },
  openGraph: {
    title: 'Flooring & Vinyl Plank Calculator (sq ft & Boxes) | SolveIt',
    description:
      'Estimate room square footage, vinyl plank or hardwood box counts, linear feet to square feet coverage, waste allowance, and material cost in 3 steps.',
    url: 'https://solveitcalculator.com/home-construction/flooring-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flooring & Vinyl Plank Calculator (sq ft & Boxes) | SolveIt',
    description: 'Estimate room square footage, vinyl plank or hardwood box counts, linear feet to square feet coverage, waste allowance, and material cost in 3 steps.',
  },
};

const FLOORING_CALCULATOR_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/home-construction/flooring-calculator#app',
      name: 'Flooring & Vinyl Plank Calculator',
      description:
        'Estimate room square footage, vinyl plank or hardwood box counts, linear feet to square feet coverage, waste allowance, and material cost in 3 steps.',
      url: 'https://solveitcalculator.com/home-construction/flooring-calculator',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/home-construction/flooring-calculator#breadcrumb',
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
          name: 'Home & Construction',
          item: 'https://solveitcalculator.com/home-construction',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Flooring Calculator',
          item: 'https://solveitcalculator.com/home-construction/flooring-calculator',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/home-construction/flooring-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much extra flooring should I add for waste?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Add 10% extra flooring for standard straight-lay rectangular rooms and 15% for diagonal layouts, herringbone patterns, or rooms with multiple closets and alcoves.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I calculate how many boxes of flooring I need?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Multiply room length by width to find net square footage, multiply by (1 + waste percentage), and divide by the square footage per box, rounding up to the next whole box.',
          },
        },
      ],
    },
  ],
};

export default function FlooringCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FLOORING_CALCULATOR_JSON_LD) }}
      />
      <FlooringProjectCalculatorClient />
      <ServerCalculatorReferenceSection
        title="Flooring Calculator"
        formulaHeading="Flooring Area & Box Count Formula Explanation"
        formulaExpression="Total Area = Length × Width × (1 + Waste%)  |  Boxes Required = ceil(Total Area ÷ Sq Ft per Box)"
        formulaExplanation="Multiply room length by width to find net floor area, apply a cutting waste allowance (typically 10% for straight-lay rooms or 15% for diagonal and herringbone layouts), then divide by the coverage printed on each carton and round up to whole boxes."
        exampleHeading="Worked Flooring Example"
        exampleSummary="Example: Installing luxury vinyl plank (20 sq ft per box) in a 14 ft × 12 ft living room with a 10% waste allowance."
        exampleSteps={[
          'Find net room area: 14 ft × 12 ft = 168 sq ft.',
          'Add 10% cutting waste: 168 sq ft × 1.10 = 184.8 total sq ft.',
          'Divide by carton coverage and round up: ceil(184.8 ÷ 20) = 10 boxes (200 sq ft ordered).',
        ]}
      />
      <CalculatorInternalLinksBand calculatorPath="/home-construction/flooring-calculator" />
    </>
  );
}
