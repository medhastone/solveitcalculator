import type { Metadata } from 'next';
import AboutMethodologyClient from '@/components/about/AboutMethodologyClient';

export const metadata: Metadata = {
  title: 'How SolveItCalculator Works — About & Calculation Methodology',
  description:
    'Learn how SolveItCalculator builds, tests, and documents free online calculators with transparent formulas, clear assumptions, and browser-first privacy.',
  openGraph: {
    title: 'How SolveItCalculator Works — About & Calculation Methodology',
    description:
      'Making calculations understandable, accessible, and useful for everyone around the world.',
  },
};

export default function AboutPage() {
  return <AboutMethodologyClient />;
}
