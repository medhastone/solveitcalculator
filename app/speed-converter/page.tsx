import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Speed & Velocity Converter — MPH, km/h, Knots, m/s, Mach | SolveIt',
  description: 'Convert speed and velocity between miles per hour (mph), kilometers per hour (km/h), knots, meters per second, feet per second, and Mach.',
  alternates: {
    canonical: 'https://solveitcalculator.com/speed-converter'
  }
};

export default function SpeedConverterPage() {
  return <CategoryConverterView categoryId="speed" />;
}
