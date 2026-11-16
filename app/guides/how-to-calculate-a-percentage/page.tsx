import type { Metadata } from 'next';
import PercentageGuideClient from '@/components/guides/PercentageGuideClient';

export const metadata: Metadata = {
  title: 'How to Calculate a Percentage — Formula & Step-by-Step Guide | SolveItCalculator',
  description:
    'Learn what a percentage is, how to calculate a percentage of a number (Result = Percentage × Number ÷ 100), and how to find percentage increase and decrease with clear worked examples.',
  alternates: {
    canonical: 'https://solveitcalculator.com/guides/how-to-calculate-a-percentage',
  },
  openGraph: {
    title: 'How to Calculate a Percentage — Formula & Step-by-Step Guide | SolveItCalculator',
    description:
      'Learn how to calculate a percentage of a number and percentage increase or decrease with step-by-step worked examples.',
    url: 'https://solveitcalculator.com/guides/how-to-calculate-a-percentage',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Calculate a Percentage — Formula & Step-by-Step Guide | SolveItCalculator',
    description:
      'Learn how to calculate a percentage of a number and percentage increase or decrease with step-by-step worked examples.',
  },
};

const PERCENTAGE_GUIDE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      '@id': 'https://solveitcalculator.com/guides/how-to-calculate-a-percentage#article',
      headline: 'How to Calculate a Percentage — Formula & Step-by-Step Guide',
      description:
        'Learn what a percentage is, how to calculate a percentage of a number (Result = Percentage × Number ÷ 100), and how to find percentage increase and decrease with clear worked examples.',
      url: 'https://solveitcalculator.com/guides/how-to-calculate-a-percentage',
      datePublished: '2026-10-20',
      dateModified: '2026-11-16',
      author: {
        '@type': 'Person',
        name: 'Krchandan',
        jobTitle: 'Founder & Writer, SolveItCalculator.com',
        url: 'https://solveitcalculator.com/about',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SolveItCalculator',
        url: 'https://solveitcalculator.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://solveitcalculator.com/apple-icon',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://solveitcalculator.com/guides/how-to-calculate-a-percentage',
      },
    },
    {
      '@type': 'HowTo',
      '@id': 'https://solveitcalculator.com/guides/how-to-calculate-a-percentage#howto',
      name: 'How to Calculate a Percentage of a Number',
      description: 'Calculate a percentage of any number using the decimal conversion formula.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Convert the percentage to a decimal',
          text: 'Divide the percentage value by 100 (for example, 20% ÷ 100 = 0.20).',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Multiply by the whole number',
          text: 'Multiply the decimal by the base number (0.20 × 150 = 30).',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Verify the percentage result',
          text: 'Check that 20% of 150 equals 30.',
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://solveitcalculator.com/guides/how-to-calculate-a-percentage#breadcrumb',
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
        {
          '@type': 'ListItem',
          position: 3,
          name: 'How to Calculate a Percentage',
          item: 'https://solveitcalculator.com/guides/how-to-calculate-a-percentage',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://solveitcalculator.com/guides/how-to-calculate-a-percentage#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the easiest way to calculate a percentage?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Divide the percentage by 100 to convert it into a decimal, then multiply by the total number: Result = (Percentage ÷ 100) × Number.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I calculate percentage increase or decrease?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Subtract the original value from the new value, divide by the original value, and multiply by 100: ((New − Old) ÷ Old) × 100.',
          },
        },
      ],
    },
  ],
};

export default function HowToCalculatePercentageGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERCENTAGE_GUIDE_JSON_LD) }}
      />
      <PercentageGuideClient />
    </>
  );
}
