import type { Metadata } from 'next';
import PrivacyAccessibilityClient from '@/components/privacy/PrivacyAccessibilityClient';

export const metadata: Metadata = {
  title: 'Privacy and Accessibility | SolveItCalculator',
  description:
    'Learn what information SolveItCalculator collects, how calculator inputs stay private in your browser, your cookie and advertising choices, and our commitment to accessibility.',
};

export default function PrivacyPolicyPage() {
  return <PrivacyAccessibilityClient />;
}
