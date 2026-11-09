import type { Metadata } from 'next';
import GuidesHubClient from '@/components/guides/GuidesHubClient';

export const metadata: Metadata = {
  title: 'Educational Guides & Formula Tutorials | SolveItCalculator',
  description:
    'Plain-English educational guides explaining math, percentage, finance, home project, and tax formulas step by step with worked examples.',
  alternates: {
    canonical: 'https://solveitcalculator.com/guides',
  },
  openGraph: {
    title: 'Educational Guides & Formula Tutorials | SolveItCalculator',
    description:
      'Step-by-step calculation guides, formulas, worked examples, and reference tables across Math, Finance, Home, and Retirement & Tax.',
    url: 'https://solveitcalculator.com/guides',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Educational Guides & Formula Tutorials | SolveItCalculator',
    description:
      'Step-by-step calculation guides, formulas, worked examples, and reference tables across Math, Finance, Home, and Retirement & Tax.',
  },
};

export default function GuidesHubPage() {
  return <GuidesHubClient />;
}
