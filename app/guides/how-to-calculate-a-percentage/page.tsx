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

export default function HowToCalculatePercentageGuidePage() {
  return <PercentageGuideClient />;
}
