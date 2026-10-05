'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Hammer,
  Grid,
  Layers,
  Shield,
  Square,
  Brush,
  Flame,
  Zap,
  Droplets,
  Trees,
  Search,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  HelpCircle,
  Briefcase,
  CheckCircle2,
  TableProperties,
} from 'lucide-react';
import InteractiveConstructionWorkbench from './InteractiveConstructionWorkbench';
import {
  HOME_CONSTRUCTION_CATEGORIES,
  MATERIAL_COVERAGE_RULES,
  CONCRETE_SLAB_LOOKUPS,
  CONSTRUCTION_WORKBENCHES,
  CONSTRUCTION_FAQS,
  ConstructionCategoryGroup,
} from './homeConstructionCategoryData';

const ICON_MAP: Record<string, React.ElementType> = {
  Hammer,
  Grid,
  Layers,
  Shield,
  Square,
  Brush,
  Flame,
  Zap,
  Droplets,
  Trees,
  Briefcase,
};

export default function HomeConstructionHubClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0, 1]);

  // Filter tools based on search and category
  const filteredCategories = useMemo(() => {
    return HOME_CONSTRUCTION_CATEGORIES.map((cat) => {
      if (activeCategoryFilter !== 'all' && cat.id !== activeCategoryFilter) {
        return null;
      }
      if (!searchQuery.trim()) {
        return cat;
      }
      const q = searchQuery.toLowerCase();
      const catMatches = cat.name.toLowerCase().includes(q) || cat.tagline.toLowerCase().includes(q);
      const matchedTools = cat.tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.desc.toLowerCase().includes(q) ||
          t.path.toLowerCase().includes(q)
      );

      if (catMatches || matchedTools.length > 0) {
        return {
          ...cat,
          tools: catMatches ? cat.tools : matchedTools,
        };
      }
      return null;
    }).filter(Boolean) as ConstructionCategoryGroup[];
  }, [searchQuery, activeCategoryFilter]);

  // Total count of available tools across all categories
  const totalToolsCount = useMemo(() => {
    return HOME_CONSTRUCTION_CATEGORIES.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, []);

  const toggleFaq = (index: number) => {
    if (openFaqIndices.includes(index)) {
      setOpenFaqIndices(openFaqIndices.filter((i) => i !== index));
    } else {
      setOpenFaqIndices([...openFaqIndices, index]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 transition-colors">
      {/* 1. Header & Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-200">Home & Construction Calculators</span>
          </nav>

          {/* Hero Titles */}
          <div className="max-w-3xl space-y-3 mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Home & Construction Calculators & Material Takeoff Workbench
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Residential building material estimators for concrete cubic yards, framing studs, roofing pitch squares, flooring boxes, drywall panels, and paint gallons. Calibrated to International Residential Code (IRC) standards.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 10 Construction Trade Categories
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {totalToolsCount}+ Specialized Estimation Tools
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dynamic Waste-Factor Scaling
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> IRC & NRMCA Standards
              </span>
            </div>
          </div>

          {/* Live Interactive Construction Workbench */}
          <InteractiveConstructionWorkbench />
        </div>
      </section>

      {/* 2. Global Search & Category Filters Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 space-y-4 transition-colors">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all 60+ construction tools (e.g. concrete slab, studs, roofing squares, paint gallons, flooring)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </div>

            {/* Quick reset if filtered */}
            {(searchQuery || activeCategoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategoryFilter('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeCategoryFilter === 'all'
                  ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Trades ({totalToolsCount})
            </button>
            {HOME_CONSTRUCTION_CATEGORIES.map((cat) => {
              const CatIcon = ICON_MAP[cat.icon] || Hammer;
              const isSelected = activeCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-600 dark:bg-amber-500 text-white dark:text-slate-950 font-semibold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 10 Trade Categories & 60+ Construction Tools Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Hammer className="w-4 h-4" />
            <span>Complete Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            All Home & Construction Categories & Estimation Tools
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Browse through all 10 building trades and select a specialized calculator for accurate material takeoffs.
          </p>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
              No construction tools matched your search for &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategoryFilter('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredCategories.map((category) => {
              const CatIcon = ICON_MAP[category.icon] || Hammer;
              return (
                <div key={category.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm transition-colors">
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                        <CatIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                          {category.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          {category.tagline}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                      {category.tools.length} Tools
                    </span>
                  </div>

                  {/* Tools Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {category.tools.map((tool, idx) => (
                      <Link
                        key={idx}
                        href={tool.path}
                        className="group flex flex-col justify-between p-4 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-slate-50/60 dark:bg-slate-950/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 hover:border-amber-300 dark:hover:border-amber-600/50 transition-all hover:shadow-md"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                              {tool.name}
                            </h4>
                            {tool.badge && (
                              <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {tool.desc}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center text-xs font-semibold text-amber-700 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                          <span>Estimate now</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Standard Building Material Coverage Rules-of-Thumb */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors">
          <div className="max-w-3xl mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <TableProperties className="w-4 h-4" />
              <span>Contractor Benchmark</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Standard Building Material Coverage Rules-of-Thumb
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Practical coverage factors and recommended waste buffers used by professional construction estimators.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="p-3.5 sm:p-4">Building Material</th>
                  <th className="p-3.5 sm:p-4">Standard Purchasing Unit</th>
                  <th className="p-3.5 sm:p-4">Rule-of-Thumb Coverage</th>
                  <th className="p-3.5 sm:p-4">Recommended Waste Buffer</th>
                  <th className="p-3.5 sm:p-4">Professional Estimator Tip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
                {MATERIAL_COVERAGE_RULES.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-900 dark:text-slate-100">{rule.material}</td>
                    <td className="p-3.5 sm:p-4 font-mono text-xs text-amber-700 dark:text-amber-400 font-bold">{rule.standardUnit}</td>
                    <td className="p-3.5 sm:p-4 font-mono text-slate-700 dark:text-slate-300 text-xs bg-slate-50/50 dark:bg-slate-950/40">{rule.ruleOfThumbCoverage}</td>
                    <td className="p-3.5 sm:p-4 font-mono text-blue-600 dark:text-blue-400 font-bold text-xs">{rule.recommendedWasteBuffer}</td>
                    <td className="p-3.5 sm:p-4 text-slate-500 dark:text-slate-400 text-xs">{rule.proTip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Concrete Slab Sizing Reference Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors">
          <div className="max-w-3xl mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <TableProperties className="w-4 h-4" />
              <span>Foundation Matrix</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Standard Concrete Slab Volume & Bag Lookup Matrix
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Ready-mix cubic yardage and pre-mix bag counts for standard residential patio, shed, and garage pads.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="p-3.5 sm:p-4">Slab Dimensions</th>
                  <th className="p-3.5 sm:p-4">Surface Area</th>
                  <th className="p-3.5 sm:p-4">Depth</th>
                  <th className="p-3.5 sm:p-4">Cubic Yards (yd³)</th>
                  <th className="p-3.5 sm:p-4">80 lb Pre-mix Bags</th>
                  <th className="p-3.5 sm:p-4">Typical Application</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
                {CONCRETE_SLAB_LOOKUPS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-900 dark:text-slate-100">{item.dimensions}</td>
                    <td className="p-3.5 sm:p-4 font-mono text-slate-600 dark:text-slate-300 text-xs">{item.areaSqFt} sq ft</td>
                    <td className="p-3.5 sm:p-4 font-mono text-slate-600 dark:text-slate-300 text-xs">{item.depthInches}&quot;</td>
                    <td className="p-3.5 sm:p-4 font-mono text-amber-700 dark:text-amber-400 font-bold">{item.cubicYards} yd³</td>
                    <td className="p-3.5 sm:p-4 font-mono text-blue-600 dark:text-blue-400 font-semibold">{item.bags80lb} Bags</td>
                    <td className="p-3.5 sm:p-4 text-slate-500 dark:text-slate-400 text-xs">{item.typicalApplication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. 6 Curated Trade Workbenches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Targeted Workflows</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Targeted Building Trade Workbenches
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Targeted estimation suites designed for general contractors, sub-trades, and DIY home remodelers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONSTRUCTION_WORKBENCHES.map((wb) => {
            const WbIcon = ICON_MAP[wb.icon] || Hammer;
            return (
              <div
                key={wb.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <WbIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {wb.title}
                      </h3>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        {wb.persona}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {wb.desc}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    {wb.recommendedTools.map((t, idx) => (
                      <Link
                        key={idx}
                        href={t.path}
                        className="block p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 hover:bg-amber-50/70 dark:hover:bg-amber-950/40 border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-700/50 transition-colors group"
                      >
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-400 flex items-center justify-between">
                          <span>{t.name}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {t.purpose}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Certification Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Building Code Compliance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              International Residential Code (IRC) & NRMCA Calibration
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every structural formula, concrete mix ratio, roofing slope multiplier, and electrical load calculation on SolveItCalculator is calibrated against the International Residential Code (IRC), the National Ready Mixed Concrete Association (NRMCA), and National Electrical Code (NEC). All calculations run 100% client-side in browser memory for complete privacy and instant calculation speed.
            </p>
          </div>
        </div>
      </section>

      {/* 8. 15 Comprehensive FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Home & Construction Estimation FAQ
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Clear answers to common questions about concrete yardage, waste factors, roofing squares, and material coverage.
          </p>
        </div>

        <div className="space-y-3">
          {CONSTRUCTION_FAQS.map((faq, index) => {
            const isOpen = openFaqIndices.includes(index);
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                    {faq.q}
                  </span>
                  <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
