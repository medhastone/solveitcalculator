'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { ConversionUnit } from '../../../lib/conversion-units';
import MassToMassWorkbench from '../../../components/conversion/dynamic/MassToMassWorkbench';
import MassToVolumeWorkbench from '../../../components/conversion/dynamic/MassToVolumeWorkbench';
import DensityTableExplorer from '../../../components/conversion/DensityTableExplorer';

interface DynamicConversionClientProps {
  unit: ConversionUnit;
}

export default function DynamicConversionClient({ unit }: DynamicConversionClientProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const isVolume = unit.type === 'volume';

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary/20">
      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          
          {/* Telemetry Bar & Breadcrumb Matrix */}
          <div className="w-full bg-surface-container-low border-b border-outline-variant/10 py-space-xs sticky top-16 z-40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row items-start md:items-center justify-between gap-space-xs font-data-mono text-body-sm text-on-surface-variant">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 overflow-x-auto text-body-sm whitespace-nowrap">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">home</span>Home
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface-variant cursor-default">Conversion</span>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface-variant cursor-default">Weight &amp; Mass</span>
                <span className="text-outline-variant">/</span>
                <Link href="/conversion/gram" className="hover:text-primary transition-colors">Gram</Link>
                <span className="text-outline-variant">/</span>
                <span className="text-primary font-semibold">Grams to {unit.name}</span>
              </nav>
              <div className="flex flex-wrap items-center gap-space-sm text-body-sm text-on-surface-variant shrink-0">
                <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-secondary font-medium">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  {isVolume ? 'USDA FDC v2 & NIST 2026' : 'SI Metrology Standards'}
                </span>
                <span className="hidden sm:inline text-outline-variant">|</span>
                <span className="hidden sm:inline">{isVolume ? '500+ Calibrated Densities' : 'Direct Scalar Conversion'}</span>
              </div>
            </div>
          </div>

          {/* Hero & Context */}
          <section className="w-full pt-space-xl pb-space-lg">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-caps font-label-caps uppercase tracking-wider mb-space-sm">
                  <span className="material-symbols-outlined text-[14px]">science</span>
                  Precision {isVolume ? 'Mass-Volume Engine' : 'Mass-Mass Engine'}
                </div>
                <h1 className="font-headline-lg text-headline-lg lg:font-display-hero lg:text-display-hero text-on-surface font-bold tracking-tight mb-space-sm">
                  Grams to {unit.name} Calculator
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-space-md">
                  {unit.heroText}
                </p>
                <div className="flex flex-wrap items-center gap-2 mb-space-md font-body-sm text-body-sm text-on-surface-variant">
                  <span className="px-2.5 py-1 rounded-md bg-surface-container flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">check_circle</span> Metrology Grade</span>
                  <span className="px-2.5 py-1 rounded-md bg-surface-container flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">check_circle</span> Zero Drift Algorithm</span>
                  {isVolume && <span className="px-2.5 py-1 rounded-md bg-surface-container flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">check_circle</span> NIST / USDA Calibrated</span>}
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Workbench Component */}
          {isVolume ? <MassToVolumeWorkbench unit={unit} /> : <MassToMassWorkbench unit={unit} />}

          {/* Data Explorer (Only for Volume Conversions) */}
          {isVolume && (
            <div className="mt-space-2xl">
              <DensityTableExplorer />
            </div>
          )}

          {/* FAQ Accordion Section */}
          <section className="w-full py-space-3xl mt-space-xl bg-surface-container-lowest">
            <div className="max-w-4xl mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="text-center mb-space-xl">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">{unit.name} FAQs</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Frequently Asked Questions</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Common metrological questions regarding grams to {unit.name.toLowerCase()} translation.</p>
              </div>
              <div className="space-y-space-sm">
                {unit.faqs.map((faq, index) => (
                  <div key={index} className="bg-surface-container-low rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
                    <button type="button" onClick={() => toggleFaq(index)} className="w-full p-space-md text-left flex items-center justify-between gap-space-sm focus:outline-none cursor-pointer">
                      <span className="font-headline-md text-[17px] font-semibold text-on-surface">{faq.q}</span>
                      <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    <div className={`px-space-md pb-space-md text-body-md text-on-surface-variant leading-relaxed ${activeFaq === index ? 'block' : 'hidden'}`}>
                      {faq.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Related Conversions Directory */}
          <section className="w-full py-space-xl bg-surface-container-low border-t border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">Metrology Directory</span>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-space-md">Related Gram Conversions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-space-sm">
                <Link href="/conversion/grams-to-milliliters" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to mL</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-teaspoons" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to tsp</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-tablespoons" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to tbsp</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-fluid-ounces" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to fl oz</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-cups" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to cups</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-ounces" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to oz</div>
                  <div className="text-[12px] text-outline font-data-mono">Mass</div>
                </Link>
                <Link href="/conversion/grams-to-pounds" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to lbs</div>
                  <div className="text-[12px] text-outline font-data-mono">Mass</div>
                </Link>
                <Link href="/conversion/grams-to-kilograms" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to kg</div>
                  <div className="text-[12px] text-outline font-data-mono">Mass</div>
                </Link>
                <Link href="/conversion/grams-to-liters" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to Liters</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-gallons" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to gal</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-pints" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to pints</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-quarts" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to quarts</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
