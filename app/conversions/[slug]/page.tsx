import { UNITS, getUnitById } from '@/lib/unit-data';
import { CONVERSION_CATEGORIES, resolveCategoryId } from '@/lib/conversions';
import CategoryConverterView from '@/components/CategoryConverterView';
import DynamicConverterClient from '@/components/conversion/DynamicConverterClient';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  // Add all categories
  for (const cat of CONVERSION_CATEGORIES) {
    params.push({ slug: cat.id });
  }

  // Add unit pairs
  for (const fromUnit of UNITS) {
    for (const toUnit of UNITS) {
      if (fromUnit.id !== toUnit.id && fromUnit.category === toUnit.category) {
        params.push({ slug: `${fromUnit.id}-to-${toUnit.id}` });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Check if category
  const catId = resolveCategoryId(slug);
  const category = CONVERSION_CATEGORIES.find((c) => c.id === catId);
  if (category) {
    return {
      title: `${category.name} Converter — Instant Precision Conversion Calculator | SolveIt`,
      description: category.description || `Convert ${category.name.toLowerCase()} units with scientific precision. Complete charts, formulas, and conversion tables.`,
      alternates: {
        canonical: `https://solveitcalculator.com/conversions/${slug}`,
      },
    };
  }

  // 2. Check if unit pair
  const parts = slug.split('-to-');
  if (parts.length === 2) {
    const fromUnit = getUnitById(parts[0]);
    const toUnit = getUnitById(parts[1]);

    if (fromUnit && toUnit) {
      return {
        title: `${fromUnit.nameSingular} to ${toUnit.nameSingular} Converter (${fromUnit.symbol} to ${toUnit.symbol})`,
        description: `Convert ${fromUnit.namePlural.toLowerCase()} to ${toUnit.namePlural.toLowerCase()} instantly. Free ${fromUnit.symbol} to ${toUnit.symbol} calculator, formula, examples, conversion chart, FAQs, and tables.`,
        alternates: {
          canonical: `https://solveitcalculator.com/conversions/${slug}`,
        },
      };
    }
  }

  return { title: 'Conversion Not Found | SolveIt Calculator' };
}

export default async function ConversionsSlugPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Check if category
  const catId = resolveCategoryId(slug);
  const category = CONVERSION_CATEGORIES.find((c) => c.id === catId);
  if (category) {
    return <CategoryConverterView categoryId={category.id} />;
  }

  // 2. Check if unit pair
  const parts = slug.split('-to-');
  if (parts.length === 2) {
    const fromUnit = getUnitById(parts[0]);
    const toUnit = getUnitById(parts[1]);

    if (fromUnit && toUnit) {
      return (
        <DynamicConverterClient
          initialFrom={fromUnit}
          initialTo={toUnit}
          slug={slug}
        />
      );
    }
  }

  notFound();
}
