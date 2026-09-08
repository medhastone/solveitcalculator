import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Frequency Converter — Hertz, kHz, MHz, GHz, RPM, Rad/s | SolveIt',
  description: 'Convert oscillation frequencies across Hertz (Hz), Kilohertz (kHz), Megahertz (MHz), Gigahertz (GHz), Revolutions per minute (RPM), and Rad/s.',
  alternates: {
    canonical: 'https://solveitcalculator.com/frequency-converter'
  }
};

export default function FrequencyConverterPage() {
  return <CategoryConverterView categoryId="frequency" />;
}
