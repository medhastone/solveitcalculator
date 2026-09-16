import type { Metadata } from 'next';
import GramToMilligramClient from '../gram-to-milligram/GramToMilligramClient';

export const metadata: Metadata = {
  title: 'Milligram to Gram Converter (mg to g) – Instant Conversion Calculator',
  description:
    'Convert milligrams to grams instantly with our free Milligram to Gram Converter. Enter milligrams and get accurate gram conversions, formulas, and FAQs.',
  alternates: {
    canonical: 'https://solveit.io/conversion/milligram-to-gram'
  }
};

export default function MilligramToGramPage() {
  return <GramToMilligramClient initialDirection="mg-to-g" />;
}
