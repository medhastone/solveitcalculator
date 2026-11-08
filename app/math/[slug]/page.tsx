import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MATH_CALCULATORS } from '@/lib/mathCalculatorsData';
import MathToolDetailClient from '@/components/math/MathToolDetailClient';

export async function generateStaticParams() {
  return MATH_CALCULATORS.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = MATH_CALCULATORS.find((t) => t.slug === slug);
  if (!tool) {
    return {
      title: 'Math Calculator | SolveItCalculator',
    };
  }
  return {
    title: `${tool.name} — Free Step-by-Step Math Calculator | SolveItCalculator`,
    description: tool.description,
    alternates: {
      canonical: `https://solveitcalculator.com/math/${tool.slug}`,
    },
  };
}

export default async function MathToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = MATH_CALCULATORS.find((t) => t.slug === slug);
  if (!tool) {
    notFound();
  }

  return <MathToolDetailClient tool={tool} />;
}
