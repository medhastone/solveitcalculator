import type { Metadata } from 'next';
import ContactErrorReportClient from '@/components/contact/ContactErrorReportClient';

export const metadata: Metadata = {
  title: 'Contact Us & Report a Calculation Error | SolveItCalculator',
  description:
    'Share general feedback, suggest a new calculator, or report a calculation error on SolveItCalculator.com with clear reproduction fields and transparent privacy.',
  openGraph: {
    title: 'How can we help? — Contact & Report a Calculation Error | SolveItCalculator',
    description:
      'Share feedback, suggest a new calculator, or report a calculation error to help improve SolveItCalculator for everyone.',
  },
};

export default function ContactPage() {
  return <ContactErrorReportClient />;
}
