import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Data Storage Converter — Bytes, KB, MB, GB, TB, PB, GiB | SolveIt Calculator',
  description: 'Convert computer digital storage capacities between Bytes, Kilobytes (KB), Megabytes (MB), Gigabytes (GB), Terabytes (TB), and binary Gibibytes (GiB).',
  alternates: {
    canonical: 'https://solveitcalculator.com/data-storage-converter'
  }
};

export default function DataStorageConverterPage() {
  return <CategoryConverterView categoryId="data_storage" />;
}
