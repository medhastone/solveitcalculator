import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTimeToolBySlug, getAllTimeTools } from '@/lib/time-date/data';
import ToolShell from '@/components/time-date/ToolShell';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = getAllTimeTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTimeToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Time & Date Calculator | SolveItCalculator',
      description: 'Precision online time and date calculation tools.',
    };
  }

  const canonicalUrl = `https://solveitcalculator.com${tool.canonicalPath}`;

  return {
    title: `${tool.metaTitle} | SolveItCalculator`,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${tool.metaTitle} | SolveItCalculator`,
      description: tool.metaDescription,
      url: canonicalUrl,
      siteName: 'SolveItCalculator',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.metaTitle} | SolveItCalculator`,
      description: tool.metaDescription,
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTimeToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolShell tool={tool} />;
}
