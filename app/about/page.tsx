import type { Metadata } from 'next';
import AboutMethodologyClient from '@/components/about/AboutMethodologyClient';

export const metadata: Metadata = {
  title: 'About SolveItCalculator — Mission, Standards & Editorial Team',
  description:
    'Learn how SolveItCalculator builds, verifies, and documents free online calculators with transparent formulas, clear assumptions, and browser-first privacy.',
  alternates: {
    canonical: 'https://solveitcalculator.com/about',
  },
  openGraph: {
    title: 'About SolveItCalculator — Mission, Standards & Editorial Team',
    description:
      'Making calculations understandable, accessible, and useful for everyone around the world.',
    url: 'https://solveitcalculator.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SolveItCalculator — Mission, Standards & Editorial Team',
    description:
      'Making calculations understandable, accessible, and useful for everyone around the world.',
  },
};

export default function AboutPage() {
  return <AboutMethodologyClient />;
}
