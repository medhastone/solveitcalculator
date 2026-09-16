import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { taxConfigData } from '@/lib/tax-data-rich';
import Header from '@/components/Header';
import GSTCalculatorClient from '../GSTCalculatorClient';
import { Metadata } from 'next';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ country: string }>;
}

export async function generateStaticParams() {
  return Object.keys(taxConfigData).map((slug) => ({
    country: slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const config = taxConfigData[country];
  
  if (!config) return {};

  const url = `https://solveitcalculator.com/tax-calculator/${config.slug}`;
  const title = config.heroTitle.split('(')[0].trim() + ' 2026 - Add or Remove GST/VAT';

  return {
    title: title,
    description: config.heroSubtitle,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title,
      description: config.heroSubtitle,
      url,
      type: 'website',
    }
  };
}

export default async function CountryTaxCalculatorPage({ params }: PageProps) {
  const { country } = await params;
  const config = taxConfigData[country];

  if (!config) {
    notFound();
  }

  // Schema.org JSON-LD
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": config.heroTitle,
    "description": config.heroSubtitle,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All modern browsers",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      
      
      {/* JSON-LD Scripts */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="flex-1 w-full pb-16">
        
        {/* Telemetry Bar & Top Breadcrumb Banner */}
        <div className="w-full bg-surface-container-lowest shadow-sm py-space-sm border-b border-surface-variant">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-2xs text-body-sm font-body-sm text-on-surface-variant flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link href="/finance" className="hover:text-primary transition-colors">Financial</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link href="/business" className="hover:text-primary transition-colors">Tax &amp; Business</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-medium" id="breadcrumb-country">{config.name} GST Calculator</span>
            </div>
            
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                FY 2026 Ready
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
                <span className="material-symbols-outlined text-[12px] text-primary">security</span>
                100% Client-Side Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps">
                <span className="material-symbols-outlined text-[12px] text-primary">gavel</span>
                {config.regulator} Statutory Formula
              </span>
            </div>
          </div>
        </div>

        {/* The fully interactive client component */}
        <GSTCalculatorClient initialJurisdiction={config.slug as any} />

      </main>
    </div>
  );
}
