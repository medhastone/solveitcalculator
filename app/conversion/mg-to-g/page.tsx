import type { Metadata } from 'next';
import GramToMilligramClient from '../gram-to-milligram/GramToMilligramClient';

export const metadata: Metadata = {
  title: 'mg to g Converter (Milligrams to Grams) – Instant Conversion Calculator',
  description:
    'Convert mg to g instantly with our free Milligrams to Grams Converter. Formula, step-by-step arithmetic, and conversion chart.',
  alternates: {
    canonical: 'https://solveit.io/conversion/milligram-to-gram'
  }
};

export default function MgToGPage() {
  return <GramToMilligramClient initialDirection="mg-to-g" />;
}
