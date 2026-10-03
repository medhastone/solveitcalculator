import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { JURISDICTION_TAX_CONFIGS } from '@/lib/financeClustersData';

interface CountrySalaryPageProps {
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

export async function generateMetadata({ params }: CountrySalaryPageProps): Promise<Metadata> {
  const resolved = await params;
  const key = COUNTRY_MAP[resolved.country.toLowerCase()];
  const config = key ? JURISDICTION_TAX_CONFIGS[key] : null;

  if (!config) {
    return {
      title: 'Salary & Paycheck Calculators by Country | SolveItCalculator',
      description: 'Country-specific gross-to-net paycheck calculations and wage conversions.'
    };
  }

  return {
    title: `${config.countryName} Salary & Paycheck Calculator (${config.taxYear}) | SolveItCalculator`,
    description: `Calculate take-home pay, hourly to annual wage conversion, and statutory payroll deductions (${config.authorityName}) for ${config.countryName}.`,
    alternates: {
      canonical: `https://solveitcalculator.com/finance/salary/${resolved.country.toLowerCase()}`
    },
    openGraph: {
      title: `${config.countryName} Take-Home Paycheck Calculator | SolveItCalculator`,
      description: `Accurate gross-to-net paycheck conversion with statutory deductions for ${config.countryName}.`,
      url: `https://solveitcalculator.com/finance/salary/${resolved.country.toLowerCase()}`,
      type: 'website'
    }
  };
}

export default async function CountrySalaryPage({ params }: CountrySalaryPageProps) {
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
        '@id': `https://solveitcalculator.com/finance/salary/${resolved.country.toLowerCase()}#webpage`,
        url: `https://solveitcalculator.com/finance/salary/${resolved.country.toLowerCase()}`,
        name: `${config.countryName} Salary & Paycheck Take-Home Breakdown`,
        description: `Gross-to-net salary conversions and statutory payroll rules for ${config.countryName}.`,
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
          { '@type': 'ListItem', position: 3, name: 'Salary & Payroll', item: 'https://solveitcalculator.com/finance/salary' },
          { '@type': 'ListItem', position: 4, name: config.countryName, item: `https://solveitcalculator.com/finance/salary/${resolved.country.toLowerCase()}` }
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
                <Link href="/finance/salary" className="hover:text-indigo-400 transition-colors">
                  Salary & Payroll
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

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{config.countryName} Payroll & Wage Breakdown</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {config.countryName} Salary & Paycheck Calculations
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-3xl">
            Convert hourly wages to annual salary, calculate bi-weekly take-home pay, and model statutory deductions administered by {config.authorityName}.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* QUICK PAYCHECK SCHEDULE CONVERSION TABLE */}
        <section aria-labelledby="paycheck-schedule-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 id="paycheck-schedule-heading" className="text-xl sm:text-2xl font-bold text-white">
                Standard Full-Time Wage Benchmarks ({config.currencyCode})
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Calculated on a standard 40-hour workweek (2,080 annual working hours).
              </p>
            </div>
            <Link
              href="/finance/salary"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              <span>Custom Paycheck Solver</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-200">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th scope="col" className="py-3 px-4">Hourly Rate</th>
                  <th scope="col" className="py-3 px-4">Weekly Gross (40h)</th>
                  <th scope="col" className="py-3 px-4">Bi-Weekly (26/yr)</th>
                  <th scope="col" className="py-3 px-4">Monthly Gross</th>
                  <th scope="col" className="py-3 px-4">Annual Gross</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {[20, 30, 40, 50, 75, 100].map((rate) => {
                  const annual = rate * 2080;
                  const weekly = rate * 40;
                  const biweekly = annual / 26;
                  const monthly = annual / 12;
                  return (
                    <tr key={rate} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-slate-200">
                        {config.currencySymbol}{rate.toFixed(2)}/hr
                      </td>
                      <td className="py-3 px-4">{config.currencySymbol}{weekly.toLocaleString()}</td>
                      <td className="py-3 px-4">{config.currencySymbol}{Math.round(biweekly).toLocaleString()}</td>
                      <td className="py-3 px-4">{config.currencySymbol}{Math.round(monthly).toLocaleString()}</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">
                        {config.currencySymbol}{annual.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* STATUTORY WITHHOLDINGS */}
        <section aria-labelledby="withholdings-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
          <h2 id="withholdings-heading" className="text-xl font-bold text-white mb-4">
            Mandatory Payroll Deductions in {config.countryName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-semibold text-white mb-1">Progressive Income Tax</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Withheld at marginal rates based on your estimated annual earnings after the standard allowance of {config.currencySymbol}{config.standardDeductionOrAllowance.toLocaleString()}.
              </p>
              <Link href={`/finance/taxes/${key}`} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 mt-2 inline-flex items-center gap-1">
                <span>View {config.countryName} Tax Brackets</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {config.additionalLevies.map((levy, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-white">{levy.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold font-mono">
                    {(levy.rate * 100).toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Mandatory statutory contribution on earnings above {config.currencySymbol}{levy.threshold.toLocaleString()}.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED COUNTRY SALARY HUBS */}
        <section aria-labelledby="other-salaries-heading" className="border-t border-slate-800 pt-8">
          <h2 id="other-salaries-heading" className="text-lg font-bold text-white mb-4">
            Compare Salary & Wages in Other Jurisdictions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(JURISDICTION_TAX_CONFIGS)
              .filter(([cKey]) => cKey !== key)
              .map(([cKey, cCfg]) => (
                <Link
                  key={cKey}
                  href={`/finance/salary/${cKey}`}
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
