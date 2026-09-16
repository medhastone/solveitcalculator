import React from 'react';
import { Metadata } from 'next';
import MathToolClient from './MathToolClient';
import { getToolData, mathToolsData } from './data';
import Link from 'next/link';


export function generateStaticParams() {
  return Object.keys(mathToolsData).map((slug) => ({
    slug,
  }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = getToolData(resolvedParams.slug);
  return {
    title: data.seoMeta.title,
    description: data.seoMeta.description,
    keywords: data.seoMeta.keywords,
  };
}

export default async function MathToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = getToolData(resolvedParams.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: data.seoMeta.title,
    description: data.seoMeta.description,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-surface flex flex-col">
        {/* Simple Top Nav */}
        <header className="sticky top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop h-16 flex items-center justify-between">
            <Link href="/" className="font-display text-title-lg font-bold text-on-surface tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[28px]">function</span>
              SolveIt
            </Link>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="border-b border-outline-variant/15 bg-surface-container-lowest">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xs">
            <nav className="flex items-center text-sm font-medium text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <Link href="/math" className="hover:text-primary transition-colors">Math Calculators</Link>
              <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
              <span className="text-on-surface line-clamp-1">{data.title}</span>
            </nav>
          </div>
        </div>

        <MathToolClient data={data} slug={resolvedParams.slug} />
      </div>
    </>
  );
}
