import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Percent,
  CheckCircle2,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { JURISDICTION_TAX_CONFIGS } from '@/lib/financeClustersData';

interface CountryTaxPageProps {
  params: Promise<{ country: string }>;
}

const COUNTRY_MAP: Record<string, string> = {
  us: 'us',
  usa: 'us',
  'united-states': 'us',
  uk: 'uk',
  'united-kingdom': 'uk',
  canada: 'canada',
  ca: 'canada',
  australia: 'australia',
  au: 'australia',
  india: 'india',
  in: 'india'
};

export async function generateStaticParams() {
  return [
    { country: 'us' },
    { country: 'uk' },
    { country: 'canada' },
    { country: 'australia' },
    { country: 'india' }
  ];
}

export async function generateMetadata({ params }: CountryTaxPageProps): Promise<Metadata> {
  const resolved = await params;
  const key = COUNTRY_MAP[resolved.country.toLowerCase()];
  const config = key ? JURISDICTION_TAX_CONFIGS[key] : null;

  if (!config) {
    return {
      title: 'Tax Calculators by Country | SolveItCalculator',
      description: 'Country-specific statutory income tax brackets and payroll calculations.'
    };
  }

  return {
    title: `${config.countryName} Income Tax & Bracket Calculator (${config.taxYear}) | SolveItCalculator`,
    description: `Official ${config.authorityName} progressive tax brackets, standard deductions (${config.currencySymbol}${config.standardDeductionOrAllowance.toLocaleString()}), statutory levies, and effective tax rates for ${config.countryName}.`,
    alternates: {
      canonical: `https://solveitcalculator.com/finance/taxes/${resolved.country.toLowerCase()}`
    },
    openGraph: {
      title: `${config.countryName} Income Tax Calculator & Statutory Brackets | SolveItCalculator`,
      description: `Accurate progressive marginal income tax calculation for ${config.countryName} with current ${config.taxYear} rules.`,
      url: `https://solveitcalculator.com/finance/taxes/${resolved.country.toLowerCase()}`,
      type: 'website'
    }
  };
}

export default async function CountryTaxPage({ params }: CountryTaxPageProps) {
  const resolved = await params;
  const key = COUNTRY_MAP[resolved.country.toLowerCase()];
  const config = key ? JURISDICTION_TAX_CONFIGS[key] : null;

  if (!config) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://solveitcalculator.com/finance/taxes/${resolved.country.toLowerCase()}#webpage`,
        url: `https://solveitcalculator.com/finance/taxes/${resolved.country.toLowerCase()}`,
        name: `${config.countryName} Income Tax & Bracket Breakdown`,
        description: `Progressive income tax rules, statutory deductions, and levies administered by ${config.authorityName}.`,
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://solveitcalculator.com/#website',
          url: 'https://solveitcalculator.com/',
          name: 'SolveItCalculator'
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveitcalculator.com' },
          { '@type': 'ListItem', position: 2, name: 'Finance', item: 'https://solveitcalculator.com/finance' },
          { '@type': 'ListItem', position: 3, name: 'Taxes', item: 'https://solveitcalculator.com/finance/taxes' },
          { '@type': 'ListItem', position: 4, name: config.countryName, item: `https://solveitcalculator.com/finance/taxes/${resolved.country.toLowerCase()}` }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER / HERO */}
      <header className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 pt-6 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <Link href="/finance" className="hover:text-indigo-400 transition-colors">
                  Finance
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <Link href="/finance/taxes" className="hover:text-indigo-400 transition-colors">
                  Taxes
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-slate-200 font-medium" aria-current="page">
                  {config.countryName}
                </span>
              </li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>{config.authorityName} · {config.taxYear}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {config.countryName} Income Tax & Statutory Brackets
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl">
            Official statutory progressive tax slabs, standard allowances, social insurance contributions, and marginal rate thresholds for tax year {config.taxYear}.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* STATUTORY TAX BRACKETS TABLE */}
        <section aria-labelledby="brackets-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 id="brackets-heading" className="text-xl sm:text-2xl font-bold text-white">
                {config.countryName} Marginal Tax Brackets ({config.taxYear})
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Standard Deduction / Personal Allowance: {config.currencySymbol}{config.standardDeductionOrAllowance.toLocaleString()} ({config.currencyCode})
              </p>
            </div>
            <Link
              href="/finance/taxes"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              <span>Launch Tax Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-200">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th scope="col" className="py-3 px-4">Taxable Income Tier ({config.currencyCode})</th>
                  <th scope="col" className="py-3 px-4">Marginal Tax Rate</th>
                  <th scope="col" className="py-3 px-4">Tax on Tier Base</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {config.brackets.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-slate-200">
                      {config.currencySymbol}{tier.min.toLocaleString()}{' '}
                      {tier.max ? `to ${config.currencySymbol}${tier.max.toLocaleString()}` : '+'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {(tier.rate * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-sans text-xs">
                      {tier.rate === 0 ? 'Tax-free allowance' : `Applies only to income above ${config.currencySymbol}${tier.min.toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ADDITIONAL STATUTORY LEVIES */}
        {config.additionalLevies.length > 0 && (
          <section aria-labelledby="levies-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
            <h2 id="levies-heading" className="text-xl font-bold text-white mb-4">
              Statutory Contributions & Payroll Levies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {config.additionalLevies.map((levy, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{levy.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Threshold: {config.currencySymbol}{levy.threshold.toLocaleString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                    {(levy.rate * 100).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* KEY STATUTORY RULES */}
        <section aria-labelledby="rules-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
          <h2 id="rules-heading" className="text-xl font-bold text-white mb-4">
            Key Statutory Rules & Assessment Guidelines ({config.authorityName})
          </h2>
          <ul className="space-y-3">
            {config.keyRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* RELATED COUNTRY HUBS */}
        <section aria-labelledby="other-countries-heading" className="border-t border-slate-800 pt-8">
          <h2 id="other-countries-heading" className="text-lg font-bold text-white mb-4">
            Explore Taxes in Other Supported Jurisdictions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(JURISDICTION_TAX_CONFIGS)
              .filter(([cKey]) => cKey !== key)
              .map(([cKey, cCfg]) => (
                <Link
                  key={cKey}
                  href={`/finance/taxes/${cKey}`}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs font-medium text-slate-300 hover:text-white flex items-center justify-between"
                >
                  <span>{cCfg.countryName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
