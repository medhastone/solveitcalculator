'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Percent,
  Rocket,
  Flame,
  BarChart3,
  Scale,
  Briefcase,
  TrendingUp,
  Boxes,
  Search,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  ShoppingCart,
  LineChart,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import InteractiveBusinessWorkbench from './InteractiveBusinessWorkbench';
import {
  BUSINESS_CATEGORIES,
  MARGIN_MARKUP_TABLE,
  SAAS_BENCHMARKS,
  FINANCIAL_RATIOS,
  ROLE_WORKBENCHES,
  BUSINESS_FAQS,
  BusinessCategory,
  BusinessTool,
} from './businessCategoryData';

const ICON_MAP: Record<string, React.ReactNode> = {
  Percent: <Percent className="w-5 h-5" />,
  Rocket: <Rocket className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Boxes: <Boxes className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  LineChart: <LineChart className="w-5 h-5" />,
};

export default function BusinessHubClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const totalToolCount = useMemo(() => {
    return BUSINESS_CATEGORIES.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, []);

  // Filter tools based on search query and selected category
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return BUSINESS_CATEGORIES.map((category) => {
      if (selectedCategory !== 'all' && category.id !== selectedCategory) {
        return { ...category, tools: [] };
      }

      if (!q) {
        return category;
      }

      const matchingTools = category.tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.formula?.toLowerCase().includes(q) ||
          tool.inputs?.some((inp) => inp.toLowerCase().includes(q)) ||
          category.name.toLowerCase().includes(q)
      );

      return {
        ...category,
        tools: matchingTools,
      };
    }).filter((cat) => cat.tools.length > 0);
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">Business Calculators</span>
        </nav>

        {/* Hero Section */}
        <header className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Institutional Financial Mathematics & SaaS Analytics Suite
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Business Calculators & Analytics Hub
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Free, institutional-grade calculation tools for profit margins, break-even unit sales, SaaS unit economics,
            startup cash runway, DuPont ROE decomposition, and operational cost accounting.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Precision Calculators
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400 mt-1">
                {totalToolCount}+
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Business Domains
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                {BUSINESS_CATEGORIES.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Interactive Solvers
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-purple-600 dark:text-purple-400 mt-1">
                5 Engines
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Target Standard
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1">
                GAAP & SaaS
              </div>
            </div>
          </div>
        </header>

        {/* Primary Interactive Multi-Metric Analytics Workbench */}
        <section aria-label="Interactive Business Workbench">
          <InteractiveBusinessWorkbench />
        </section>

        {/* Directory Search & Filter Controls */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 50+ business calculators..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results Counter */}
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Showing{' '}
              <span className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {filteredCategories.reduce((sum, c) => sum + c.tools.length, 0)}
              </span>{' '}
              of {totalToolCount} calculators
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Topics ({totalToolCount})
            </button>
            {BUSINESS_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {ICON_MAP[cat.iconName]}
                <span>{cat.name}</span>
                <span className="opacity-70 font-mono text-[10px]">({cat.tools.length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categorized Tools Directory */}
        <div className="space-y-12 mb-16">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
              <HelpCircle className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No calculators found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                No tools matched your search for &ldquo;{searchQuery}&rdquo;. Try another term or reset your category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <section key={category.id} id={category.slug} className="scroll-mt-6">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                    {ICON_MAP[category.iconName]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {category.name}
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        {category.tools.length} Tools
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{category.tagline}</p>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="group relative flex flex-col justify-between p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition duration-150"
                    >
                      <div>
                        {/* Badges */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          {tool.badge ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                              {tool.badge}
                            </span>
                          ) : (
                            <span />
                          )}
                          {tool.isPopular && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                              Popular
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition flex items-center justify-between">
                          <Link href={tool.href} className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true" />
                            {tool.name}
                          </Link>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                          {tool.description}
                        </p>

                        {/* Mathematical Formula Preview */}
                        {tool.formula && (
                          <div className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">
                            <span className="text-slate-400 font-sans mr-1">Formula:</span>
                            {tool.formula}
                          </div>
                        )}
                      </div>

                      {/* Inputs / Output summary */}
                      {tool.output && (
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Output:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                            {tool.output}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {/* =========================================================================
            AUXILIARY BENCHMARKS & REFERENCE GUIDES
        ========================================================================= */}
        <section className="mb-16 space-y-12">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
              Industry Financial Reference Tables & Benchmarks
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Empirical reference standards for margin conversions, SaaS health metrics, and corporate financial ratios.
            </p>
          </div>

          {/* 1. Profit Margin vs Markup Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Percent className="w-5 h-5 text-blue-600" />
                  Profit Margin vs Markup Conversion Matrix ($100 Base Cost)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Quick lookup for converting between desired gross margin percentages and required cost markups.
                </p>
              </div>
              <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                Formula: Markup = Margin / (1 - Margin)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
                    <th className="py-3 px-4 font-semibold">Gross Margin %</th>
                    <th className="py-3 px-4 font-semibold">Required Markup %</th>
                    <th className="py-3 px-4 font-semibold">Selling Price ($)</th>
                    <th className="py-3 px-4 font-semibold">Gross Profit ($)</th>
                    <th className="py-3 px-4 font-semibold">Common Industry Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono tabular-nums">
                  {MARGIN_MARKUP_TABLE.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition ${
                        row.marginPercent === 50
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 font-bold text-blue-900 dark:text-blue-200'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {row.marginPercent.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                        {row.markupPercent.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-4">${row.price.toFixed(2)}</td>
                      <td className="py-2.5 px-4">${row.profit.toFixed(2)}</td>
                      <td className="py-2.5 px-4 font-sans text-xs text-slate-500 dark:text-slate-400">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. SaaS Unit Economics Benchmarks */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-purple-600" />
                SaaS & Subscription Unit Economics Benchmarks
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Institutional target ranges for venture-backed and bootstrapped subscription software companies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAAS_BENCHMARKS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.metric}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Good:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.good}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-500">Great:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{item.great}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-500">World-Class:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.worldClass}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Corporate Financial Ratios Reference */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Corporate Financial Statement Ratios
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Standard solvency, liquidity, efficiency, and profitability ratios used in financial analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FINANCIAL_RATIOS.map((ratio, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{ratio.name}</h4>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {ratio.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{ratio.interpretation}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                    <div className="font-mono text-slate-500 dark:text-slate-400 truncate">
                      Formula: <strong className="text-slate-800 dark:text-slate-200">{ratio.formula}</strong>
                    </div>
                    <div className="flex justify-between font-mono text-emerald-600 dark:text-emerald-400">
                      <span>Target Range:</span>
                      <span className="font-bold">{ratio.idealRange}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            6 CURATED ROLE-BASED WORKBENCHES
        ========================================================================= */}
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
              Curated Role-Based Tool Workbenches
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Purpose-built calculator suites organized around executive, operational, and freelance responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROLE_WORKBENCHES.map((bench) => (
              <div
                key={bench.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      {ICON_MAP[bench.icon]}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{bench.title}</h3>
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{bench.role}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {bench.description}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                    {bench.toolSlugs.map((slug) => {
                      // Find tool name across all categories
                      let toolName = slug.replace(/-/g, ' ');
                      BUSINESS_CATEGORIES.forEach((cat) => {
                        const found = cat.tools.find((t) => t.id === slug || t.href.includes(slug));
                        if (found) toolName = found.name;
                      });

                      return (
                        <Link
                          key={slug}
                          href={`/business/${slug}`}
                          className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1 transition group"
                        >
                          <span className="truncate">{toolName}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            FAQ SECTION WITH SCHEMA.ORG JSON-LD ACCORDION
        ========================================================================= */}
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
              Frequently Asked Questions on Business & Managerial Math
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Comprehensive guidance on pricing strategies, startup fundraising metrics, corporate ratios, and cash flow formulas.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {BUSINESS_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
