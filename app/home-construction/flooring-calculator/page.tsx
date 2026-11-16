import type { Metadata } from 'next';
import FlooringProjectCalculatorClient from '@/components/calculators/FlooringProjectCalculatorClient';

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
    </>
  );
}
