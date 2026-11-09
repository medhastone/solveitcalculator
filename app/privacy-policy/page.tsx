import type { Metadata } from 'next';
import PrivacyAccessibilityClient from '@/components/privacy/PrivacyAccessibilityClient';

export const metadata: Metadata = {
  title: 'Privacy Policy & Browser Data Protection | SolveItCalculator',
  description:
    'Learn what information SolveItCalculator collects, how calculator inputs stay private in your browser, your cookie and advertising choices, and our commitment to data protection.',
  alternates: {
    canonical: 'https://solveitcalculator.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy & Browser Data Protection | SolveItCalculator',
    description:
      'Learn how calculator inputs stay 100% private in your browser on SolveItCalculator.com.',
    url: 'https://solveitcalculator.com/privacy-policy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy & Browser Data Protection | SolveItCalculator',
    description:
      'Learn how calculator inputs stay 100% private in your browser on SolveItCalculator.com.',
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyAccessibilityClient />;
}
