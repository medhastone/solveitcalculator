import type { Metadata } from 'next';
import GramToMilligramClient from '../gram-to-milligram/GramToMilligramClient';

export const metadata: Metadata = {
  title: 'g to mg Converter (Grams to Milligrams) – Instant Calculation',
  description:
    'Convert g to mg instantly. Free grams to milligrams converter with exact formulas, clinical decimal steps, and conversion chart.',
  alternates: {
    canonical: 'https://solveit.io/conversion/gram-to-milligram'
  }
};

export default function GToMgPage() {
  return <GramToMilligramClient />;
}
