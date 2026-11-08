import type { Metadata } from 'next';
import PrivacyAccessibilityClient from '@/components/privacy/PrivacyAccessibilityClient';

export const metadata: Metadata = {
  title: 'Privacy and Accessibility | SolveItCalculator',
  description:
    'Learn what information SolveItCalculator collects, how calculator inputs are processed locally in your browser, your data choices, and our accessibility options.',
};

export default function PrivacyAndAccessibilityPage() {
  return <PrivacyAccessibilityClient />;
}
