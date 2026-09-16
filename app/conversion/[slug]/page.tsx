import { UNITS, getUnitById } from '@/lib/unit-data';
import DynamicConverterClient from '@/components/conversion/DynamicConverterClient';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  
  for (const fromUnit of UNITS) {
    for (const toUnit of UNITS) {
      if (fromUnit.id !== toUnit.id && fromUnit.category === toUnit.category) {
        params.push({ slug: `${fromUnit.id}-to-${toUnit.id}` });
      }
    }
  }
  
  return params;
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const parts = params.slug.split('-to-');
  if (parts.length !== 2) return { title: 'Conversion Not Found' };
  
  const fromUnit = getUnitById(parts[0]);
  const toUnit = getUnitById(parts[1]);

  if (!fromUnit || !toUnit) {
    return { title: 'Conversion Not Found | SolveIt Calculator' };
  }

  return {
    title: `${fromUnit.nameSingular} to ${toUnit.nameSingular} Converter (${fromUnit.symbol} to ${toUnit.symbol})`,
    description: `Convert ${fromUnit.namePlural.toLowerCase()} to ${toUnit.namePlural.toLowerCase()} instantly. Free ${fromUnit.symbol} to ${toUnit.symbol} calculator, formula, examples, conversion chart, FAQs, and tables.`,
    alternates: {
      canonical: `https://solveitcalculator.com/conversion/${params.slug}`
    }
  };
}

export default function DynamicConversionPage({ params }: { params: { slug: string } }) {
  const parts = params.slug.split('-to-');
  if (parts.length !== 2) notFound();

  const fromUnit = getUnitById(parts[0]);
  const toUnit = getUnitById(parts[1]);

  if (!fromUnit || !toUnit) {
    notFound();
  }

  return <DynamicConverterClient initialFrom={fromUnit} initialTo={toUnit} slug={params.slug} />;
}
