import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Data Transfer Rate Converter — Mbps, MB/s, Gbps, KB/s | SolveIt',
  description: 'Convert internet bandwidth and network speeds between Megabits/s (Mbps), Megabytes/s (MB/s), Gigabits/s (Gbps), and calculate true file download times.',
  alternates: {
    canonical: 'https://solveitcalculator.com/data-transfer-converter'
  }
};

export default function DataTransferConverterPage() {
  return <CategoryConverterView categoryId="data_transfer" />;
}
