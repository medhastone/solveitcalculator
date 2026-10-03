'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Calculator,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Compass,
  Layers,
  Sparkles,
  Globe,
  Sliders,
  DollarSign
} from 'lucide-react';
import { FinanceSubcategoryCluster, JurisdictionTaxConfig } from '@/lib/financeClustersData';
import { CANONICAL_TOOLS, CanonicalTool } from '@/lib/registry';

interface FinanceSubcategoryHubProps {
  cluster: FinanceSubcategoryCluster;
}

export default function FinanceSubcategoryHub({ cluster }: FinanceSubcategoryHubProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('us');

  // Resolved tools for this cluster
  const clusterTools = cluster.primaryToolIds
    .map((id) => CANONICAL_TOOLS.find((t) => t.id === id))
    .filter(Boolean) as CanonicalTool[];

  const activeJurisdictionConfig = cluster.jurisdictionConfigs?.find(
    (j) => j.countryCode.toLowerCase() === selectedJurisdiction.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* 1. BREADCRUMB & 2. SEO H1 & INTRO */}
      <header className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 pt-6 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb: Home → Finance → Subcategory */}
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
                <span className="text-slate-200 font-medium" aria-current="page">
                  {cluster.title}
                </span>
              </li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Finance Topic Cluster</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {cluster.h1}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-4xl">
            {cluster.description}
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* GOAL-BASED TASK WORKFLOW */}
        <section aria-labelledby="cluster-goals-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Direct Task Navigation</span>
            </div>
            <h2 id="cluster-goals-heading" className="text-2xl font-bold text-white mb-1">
              What do you want to calculate?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Jump directly to the exact calculation engine for your specific financial task.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cluster.goalTasks.map((g, idx) => (
              <Link
                key={idx}
                href={g.targetUrl}
                className="group p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-2 inline-block">
                    {g.badge}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                    {g.task}
                  </h3>
                </div>
                <div className="mt-3 text-xs text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Launch Calculator <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* PRIMARY CALCULATORS IN CLUSTER */}
        <section aria-labelledby="tools-heading">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
            <div>
              <h2 id="tools-heading" className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-400" />
                <span>Verified Calculators in {cluster.title}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Complete calculation models with real-time interactive results and step-by-step proofs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clusterTools.map((tool) => (
              <article
                key={tool.id}
                className="group bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {tool.badge || 'Tool'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {tool.calculationStandard ? 'Verified Standard' : 'Deterministic Math'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                    <Link href={tool.canonicalPath} className="focus:outline-none">
                      {tool.name || tool.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed font-normal">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  {tool.formulaDisplay ? (
                    <code className="text-[11px] text-amber-300/80 font-mono truncate max-w-[180px]">
                      {tool.formulaDisplay}
                    </code>
                  ) : (
                    <span className="text-slate-500 font-mono">Formula Engine</span>
                  )}
                  <Link
                    href={tool.canonicalPath}
                    className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* METROLOGY & TRANSPARENCY: MATH vs ASSUMPTIONS vs CURRENT RULES vs INFO */}
        <section aria-labelledby="transparency-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Data & Methodology Standards</span>
            </div>
            <h2 id="transparency-heading" className="text-xl sm:text-2xl font-bold text-white mb-1">
              Methodology, Model Assumptions & Statutory Rules
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              SolveItCalculator strictly separates mathematical equations, baseline assumptions, current statutory rules, and general financial planning information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            {/* Box 1: Calculator Math */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Calculator className="w-4 h-4" />
                <span>1. Deterministic Calculator Math</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-normal">
                {cluster.calculatorMathOverview}
              </p>
            </div>

            {/* Box 2: Model Assumptions */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Sliders className="w-4 h-4" />
                <span>2. Model Assumptions</span>
              </div>
              <ul className="space-y-1 text-slate-300 list-disc list-inside font-normal">
                {cluster.modelAssumptions.map((asm, idx) => (
                  <li key={idx}>{asm}</li>
                ))}
              </ul>
            </div>

            {/* Box 3: Current Statutory Rules */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Current Statutory / Tax Rules</span>
              </div>
              <ul className="space-y-1 text-slate-300 list-disc list-inside font-normal">
                {cluster.currentStatutoryRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Box 4: Financial Information Principles */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>4. Financial Information & Principles</span>
              </div>
              <ul className="space-y-1 text-slate-300 list-disc list-inside font-normal">
                {cluster.financialInformationPrinciples.map((info, idx) => (
                  <li key={idx}>{info}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* REAL JURISDICTION-SPECIFIC ENGINES (US, UK, CA, AU, IN) */}
        {cluster.jurisdictionConfigs && cluster.jurisdictionConfigs.length > 0 && (
          <section aria-labelledby="jurisdictions-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  <Globe className="w-4 h-4" />
                  <span>Real Jurisdiction Calculation Engines</span>
                </div>
                <h2 id="jurisdictions-heading" className="text-xl sm:text-2xl font-bold text-white">
                  Statutory Tax Brackets & Gazetted Rules
                </h2>
              </div>

              {/* Country Tabs */}
              <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                {cluster.jurisdictionConfigs.map((j) => (
                  <button
                    key={j.countryCode}
                    onClick={() => setSelectedJurisdiction(j.countryCode.toLowerCase())}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedJurisdiction === j.countryCode.toLowerCase()
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {j.countryName}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Jurisdiction Card */}
            {activeJurisdictionConfig && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {activeJurisdictionConfig.countryName} — {activeJurisdictionConfig.authorityName}
                    </h3>
                    <span className="text-xs text-slate-400">
                      Applicable Tax Year: {activeJurisdictionConfig.taxYear} | Base Allowance / Standard Deduction:{' '}
                      <strong className="text-emerald-400">
                        {activeJurisdictionConfig.currencySymbol}
                        {activeJurisdictionConfig.standardDeductionOrAllowance.toLocaleString()}
                      </strong>
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-indigo-300 font-mono">
                    Currency: {activeJurisdictionConfig.currencyCode}
                  </span>
                </div>

                {/* Statutory Brackets Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                    <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Taxable Bracket Threshold</th>
                        <th className="py-2.5 px-3">Marginal Tax Rate</th>
                        <th className="py-2.5 px-3">Statutory Tier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                      {activeJurisdictionConfig.brackets.map((b, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="py-2 px-3">
                            {activeJurisdictionConfig.currencySymbol}{b.min.toLocaleString()}
                            {b.max !== null ? ` – ${activeJurisdictionConfig.currencySymbol}${b.max.toLocaleString()}` : ' and above'}
                          </td>
                          <td className="py-2 px-3 font-bold text-emerald-400">
                            {(b.rate * 100).toFixed(1)}%
                          </td>
                          <td className="py-2 px-3 text-slate-400 font-sans">
                            {idx === 0 && b.rate === 0 ? 'Tax-Free Allowance Band' : `Marginal Band ${idx + 1}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Key Jurisdictional Rules */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">
                    Key Statutory Rules ({activeJurisdictionConfig.countryName}):
                  </h4>
                  <ul className="space-y-1 list-disc list-inside">
                    {activeJurisdictionConfig.keyRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        )}

        {/* IN-DEPTH TOPIC CLUSTER GUIDES */}
        {cluster.guides.length > 0 && (
          <section aria-labelledby="guides-heading" className="space-y-6">
            <div className="pb-3 border-b border-slate-800">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Educational Topic Guides</span>
              </div>
              <h2 id="guides-heading" className="text-xl sm:text-2xl font-bold text-white">
                How Financial Calculations Work: Guides & Worked Proofs
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cluster.guides.map((g) => (
                <article key={g.slug} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{g.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{g.description}</p>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Governing Formula</span>
                      <code className="text-xs text-amber-300 font-mono font-bold block overflow-x-auto pb-0.5">{g.formula}</code>
                    </div>

                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-indigo-950/60 text-xs mb-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">Worked Example: {g.workedExample.scenario}</span>
                      <div className="font-mono text-slate-400 text-[11px] mb-1">Calculation: {g.workedExample.calculation}</div>
                      <div className="font-bold text-emerald-400 text-xs">Result: {g.workedExample.result}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-start gap-2 text-xs text-indigo-300">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Key Takeaway: </strong>{g.keyTakeaway}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* RELATED FINANCE CLUSTERS (Contextual Linking) */}
        <section aria-labelledby="related-clusters-heading">
          <div className="pb-3 border-b border-slate-800 mb-6">
            <h2 id="related-clusters-heading" className="text-xl font-bold text-white">
              Related Finance Clusters & Topics
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore connected financial modeling disciplines across SolveItCalculator.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cluster.relatedClusterSlugs.map((slug) => {
              const rel = require('@/lib/financeClustersData').FINANCE_SUBCATEGORY_CLUSTERS[slug];
              if (!rel) return null;
              return (
                <Link
                  key={slug}
                  href={rel.canonicalPath}
                  className="group bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-4 transition-all hover:bg-slate-900"
                >
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between mb-1">
                    <span>{rel.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {rel.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SEARCH-INTENT FAQ */}
        <section aria-labelledby="faq-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Search-Intent FAQ</span>
            </div>
            <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-white mb-1">
              {cluster.title} Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {cluster.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-indigo-300 transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-90 text-indigo-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
