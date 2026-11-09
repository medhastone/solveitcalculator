import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ScienceCalculatorsClient, {
  ScienceCalculatorSlug,
} from '@/components/calculators/ScienceCalculatorsClient';

const SCIENCE_SLUGS: Record<
  ScienceCalculatorSlug,
  { title: string; description: string }
> = {
  'density-calculator': {
    title: 'Density Calculator (ρ = m ÷ V) — Mass, Volume & Density | SolveItCalculator',
    description:
      'Calculate density, mass, or volume using ρ = m ÷ V in g/cm³, g/mL, and kg/m³ with pure-water buoyancy comparison.',
  },
  'force-calculator': {
    title: 'Force Calculator (Newton’s Second Law F = m × a) | SolveItCalculator',
    description:
      'Calculate net force in Newtons (N), mass (kg), or acceleration (m/s²) using Newton’s Second Law of Motion.',
  },
  'ohms-law-calculator': {
    title: "Ohm's Law Calculator — Voltage, Current, Resistance & Power | SolveItCalculator",
    description:
      'Calculate Voltage (V), Current (I), Resistance (R), and Electrical Power (W) using Ohm’s Law and Joule’s Law.',
  },
  'molarity-calculator': {
    title: 'Molarity & Solution Concentration Calculator | SolveItCalculator',
    description:
      'Calculate solution molarity (mol/L), required solute mass (g), or solution volume (L) from molecular weight.',
  },
};

export async function generateStaticParams() {
  return Object.keys(SCIENCE_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = SCIENCE_SLUGS[slug as ScienceCalculatorSlug];
  if (!meta) {
    return {
      title: 'Science Calculator | SolveItCalculator',
    };
  }
  const canonicalUrl = `https://solveitcalculator.com/science/${slug}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function ScienceToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in SCIENCE_SLUGS)) {
    notFound();
  }
  return <ScienceCalculatorsClient slug={slug as ScienceCalculatorSlug} />;
}
