import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Data Transfer Rate Converter — Mbps, MB/s, Gbps, KB/s | SolveIt Calculator',
  description: 'Convert internet bandwidth and network speeds between Megabits/s (Mbps), Megabytes/s (MB/s), Gigabits/s (Gbps), and calculate true file download times.',
  alternates: {
    canonical: 'https://solveitcalculator.com/data-transfer-rate-converter'
  }
};

export default function DataTransferRateConverterPage() {
  return <CategoryConverterView categoryId="data_transfer" />;
}
