import type { Metadata } from 'next';
import GramToMilligramClient from '../gram-to-milligram/GramToMilligramClient';

export const metadata: Metadata = {
  title: 'Gram to Milligrams Converter (g to mg) – Instant Conversion Calculator',
  description:
    'Convert grams to milligrams instantly with our free Gram to Milligrams Converter. Enter any value in grams and get accurate milligram conversions, formulas, conversion tables, and FAQs.',
  alternates: {
    canonical: 'https://solveit.io/conversion/gram-to-milligram'
  }
};

export default function GramToMilligramsPage() {
  return <GramToMilligramClient />;
}
