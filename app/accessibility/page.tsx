import type { Metadata } from 'next';
import PrivacyAccessibilityClient from '@/components/privacy/PrivacyAccessibilityClient';

export const metadata: Metadata = {
  title: 'Accessibility Statement & Display Preferences | SolveItCalculator',
  description:
    'Customize your accessibility preferences (text size, high contrast, dark mode, reduced motion) and read our commitment to WCAG keyboard and screen-reader accessibility.',
  alternates: {
    canonical: 'https://solveitcalculator.com/accessibility',
  },
  openGraph: {
    title: 'Accessibility Statement & Display Preferences | SolveItCalculator',
    description:
      'Customize your accessibility preferences and read our commitment to accessible online calculators.',
    url: 'https://solveitcalculator.com/accessibility',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accessibility Statement & Display Preferences | SolveItCalculator',
    description:
      'Customize your accessibility preferences and read our commitment to accessible online calculators.',
  },
};

export default function AccessibilityPage() {
  return <PrivacyAccessibilityClient pageVariant="accessibility" />;
}
