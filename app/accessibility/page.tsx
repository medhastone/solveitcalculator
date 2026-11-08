import type { Metadata } from 'next';
import PrivacyAccessibilityClient from '@/components/privacy/PrivacyAccessibilityClient';

export const metadata: Metadata = {
  title: 'Privacy and Accessibility | SolveItCalculator',
  description:
    'Customize your accessibility preferences (text size, high contrast, dark mode, reduced motion) and read how SolveItCalculator handles privacy and browser-based calculations.',
};

export default function AccessibilityPage() {
  return <PrivacyAccessibilityClient />;
}
