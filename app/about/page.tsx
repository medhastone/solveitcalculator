import type { Metadata } from 'next';
import AboutMethodologyClient from '@/components/about/AboutMethodologyClient';

export const metadata: Metadata = {
  title: 'About SolveItCalculator — Founder, Editorial Policy & Testing',
  description:
    'Learn who runs SolveItCalculator (founder Krchandan), what the site does and does not do, how calculators are built and tested, and our editorial policy.',
  alternates: {
    canonical: 'https://solveitcalculator.com/about',
  },
  openGraph: {
    title: 'About SolveItCalculator — Founder, Editorial Policy & Testing',
    description:
      'Who runs SolveItCalculator, what our calculators do and do not do, how tools are built and tested, error reporting, and our editorial policy.',
    url: 'https://solveitcalculator.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SolveItCalculator — Founder, Editorial Policy & Testing',
    description:
      'Who runs SolveItCalculator, what our calculators do and do not do, how tools are built and tested, error reporting, and our editorial policy.',
  },
};

export default function AboutPage() {
  return <AboutMethodologyClient pageVariant="about" />;
}
