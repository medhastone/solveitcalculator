import type { Metadata } from 'next';
import GramToMilligramClient from '../gram-to-milligram/GramToMilligramClient';

export const metadata: Metadata = {
  title: 'Grams to mg Converter (g to mg) – Instant Conversion Calculator',
  description:
    'Convert grams to mg instantly with our free Grams to Milligrams Converter. Formulas, steps, and instant chart.',
  alternates: {
    canonical: 'https://solveit.io/conversion/gram-to-milligram'
  }
};

export default function GramsToMgPage() {
  return <GramToMilligramClient />;
}
