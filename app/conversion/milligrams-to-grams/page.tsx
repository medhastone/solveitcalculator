import type { Metadata } from 'next';
import GramToMilligramClient from '../gram-to-milligram/GramToMilligramClient';

export const metadata: Metadata = {
  title: 'Milligrams to Grams Converter (mg to g) – Instant Conversion Calculator',
  description:
    'Convert milligrams to grams instantly with our free Milligrams to Grams Converter. Enter milligrams and get accurate gram conversions, formulas, and FAQs.',
  alternates: {
    canonical: 'https://solveit.io/conversion/milligram-to-gram'
  }
};

export default function MilligramsToGramsPage() {
  return <GramToMilligramClient initialDirection="mg-to-g" />;
}
