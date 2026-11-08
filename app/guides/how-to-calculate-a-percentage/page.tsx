import type { Metadata } from 'next';
import PercentageGuideClient from '@/components/guides/PercentageGuideClient';

export const metadata: Metadata = {
  title: 'How to Calculate a Percentage — Formula & Step-by-Step Guide | SolveItCalculator',
  description:
    'Learn what a percentage is, how to calculate a percentage of a number (Result = Percentage × Number ÷ 100), and how to find percentage increase and decrease with clear worked examples.',
};

export default function HowToCalculatePercentageGuidePage() {
  return <PercentageGuideClient />;
}
