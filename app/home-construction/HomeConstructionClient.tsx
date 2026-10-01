'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { PopularCalcId, UnitSystem } from './components/types';
import { CATEGORY_GROUPS } from './components/categoriesData';
import ProjectDiscovery from './components/ProjectDiscovery';
import PopularCalculators from './components/PopularCalculators';
import EducationalSections from './components/EducationalSections';

export default function HomeConstructionClient() {
  const [activeCalc, setActiveCalc] = useState<PopularCalcId>('concrete');
  const [activeProjectId, setActiveProjectId] = useState<string>('pour-concrete');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('us');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [copiedBOM, setCopiedBOM] = useState<boolean>(false);

  const popularCalculatorsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Handle Project Selection from "What Are You Building?"
  const handleSelectProject = (projectId: string, defaultTool: string) => {
    setActiveProjectId(projectId);
    if (defaultTool in {
      concrete: 1,
      roofing: 1,
      flooring: 1,
      paint: 1,
      drywall: 1,
      lumber: 1,
      deck: 1,
      fence: 1,
      gravel: 1,
      mulch: 1,
    }) {
      setActiveCalc(defaultTool as PopularCalcId);
    }
    popularCalculatorsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter Categories & Tools by Search Query
  const filteredCategories = useMemo(() => {
    let list = CATEGORY_GROUPS;
    if (selectedCategoryFilter !== 'all') {
      list = list.filter(cat => cat.id === selectedCategoryFilter);
    }
    if (!searchQuery.trim()) {
      return list;
    }
    const q = searchQuery.toLowerCase().trim();
    return list
      .map(cat => {
        const matchesCategory =
          cat.title.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q);
        const matchedSubcategories = cat.subcategories
          .map(sub => {
            const matchesSub =
              sub.title.toLowerCase().includes(q) || sub.description.toLowerCase().includes(q);
            const matchedTools = sub.tools.filter(
              t =>
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                (t.badge && t.badge.toLowerCase().includes(q))
            );
            if (matchesSub || matchedTools.length > 0) {
              return {
                ...sub,
                tools: matchesSub ? sub.tools : matchedTools,
              };
            }
            return null;
          })
          .filter(Boolean) as typeof cat.subcategories;

        if (matchesCategory || matchedSubcategories.length > 0) {
          return {
            ...cat,
            subcategories: matchesCategory ? cat.subcategories : matchedSubcategories,
          };
        }
        return null;
      })
      .filter(Boolean) as typeof CATEGORY_GROUPS;
  }, [searchQuery, selectedCategoryFilter]);

  const handleToolClick = (targetCalc: string) => {
    if (targetCalc in {
      concrete: 1,
      roofing: 1,
      flooring: 1,
      paint: 1,
      drywall: 1,
      lumber: 1,
      deck: 1,
      fence: 1,
      gravel: 1,
      mulch: 1,
    }) {
      setActiveCalc(targetCalc as PopularCalcId);
      popularCalculatorsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyBOM = () => {
    const text = `SolveItCalculator - Project Estimate Summary\nActive Calculator: ${activeCalc.toUpperCase()}\nUnit System: ${unitSystem.toUpperCase()}\nStatus: Verified Calculation Baseline\nNotes: Quantities include configurable jobsite cut and waste allowances.\nURL: https://solveitcalculator.com/home-construction/`;
    navigator.clipboard?.writeText(text);
    setCopiedBOM(true);
    setTimeout(() => setCopiedBOM(false), 2500);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary/20 selection:text-primary pt-0">
      {/* DEDICATED VISIBLE BREADCRUMB BAR (COMPLETELY CLEAR OF FIXED HEADER) */}
      <section aria-label="Breadcrumb Navigation" className="w-full bg-surface-container-low border-b border-outline-variant/30 py-3 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant flex-wrap font-medium">
            <Link
              href="/"
              className="hover:text-primary transition-colors flex items-center gap-1.5 font-semibold text-on-surface hover:underline"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">home</span>
              <span>Home</span>
            </Link>
            <span className="text-outline-variant select-none">/</span>
            <span className="text-primary font-bold" aria-current="page">
              Home &amp; Construction Calculators
            </span>
          </nav>
          <div className="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px]">
              <span className="material-symbols-outlined text-[14px]">handyman</span>
              <span>Trade Estimator Tools</span>
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 1: HERO */}
      <header className="w-full pt-6 pb-12 md:pt-8 md:pb-16 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/20 bg-linear-to-b from-surface-container-low/60 to-surface">
        <div className="max-w-7xl mx-auto">
          {/* Hero Messaging */}
          <div className="max-w-4xl">
            <h1 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">construction</span>
              Home &amp; Construction Calculators
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              Plan, Measure &amp; Estimate Your Next Project
            </h2>
            <p className="mt-4 text-base sm:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
              Calculate materials, dimensions, quantities, and project estimates for home improvement and construction projects.
            </p>
          </div>

          {/* CORE UX PROCESS STEPS */}
          <div className="mt-8 pt-6 border-t border-outline-variant/20">
            <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">linear_scale</span>
              <span>Core Estimating Workflow:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {[
                { step: '1', title: 'Choose Project', desc: 'Select trade or structure' },
                { step: '2', title: 'Enter Measurements', desc: 'Input length, width, depth' },
                { step: '3', title: 'Calculate', desc: 'Review net & gross volume' },
                { step: '4', title: 'Review Assumptions', desc: 'Adjust waste & coverage' },
                { step: '5', title: 'Export / Plan', desc: 'Save bill of materials' },
              ].map(st => (
                <div
                  key={st.step}
                  className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {st.step}
                  </span>
                  <div>
                    <strong className="block text-on-surface text-[12px] font-semibold">{st.title}</strong>
                    <span className="text-[11px] text-on-surface-variant">{st.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Quick Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-xl">search</span>
              </span>
              <input
                type="text"
                placeholder="Search calculators (e.g. concrete slab, roofing pitch, drywall mud, deck joists, siding)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-on-surface-variant hover:text-on-surface"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => popularCalculatorsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-3 bg-primary text-on-primary rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">tune</span>
                <span>Open Calculator</span>
              </button>
              <button
                type="button"
                onClick={() => categoriesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-3 bg-surface-container text-on-surface rounded-xl text-xs sm:text-sm font-medium hover:bg-surface-container-high transition-all flex items-center justify-center gap-1.5 border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-base">category</span>
                <span>All Categories</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* SECTION 2: WHAT ARE YOU BUILDING OR RENOVATING? */}
        <ProjectDiscovery
          onSelectProject={handleSelectProject}
          activeProjectId={activeProjectId}
        />

        {/* SECTION 3: POPULAR CONSTRUCTION CALCULATORS (FEATURED NEAR TOP) */}
        <div ref={popularCalculatorsRef}>
          <PopularCalculators
            activeCalc={activeCalc}
            onSelectCalc={setActiveCalc}
            unitSystem={unitSystem}
            onUnitChange={setUnitSystem}
          />
        </div>

        {/* SECTION 4: EXPORT / PLAN & BILL OF MATERIALS STRIP */}
        <section className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">description</span>
              </span>
              <div>
                <h4 className="text-sm font-bold text-on-surface">Project Takeoff Summary Ready</h4>
                <p className="text-xs text-on-surface-variant">
                  Current active tool: <span className="font-semibold text-primary uppercase">{activeCalc}</span> with configured waste margins.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyBOM}
                className="px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold border border-outline-variant/30 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">
                  {copiedBOM ? 'check' : 'content_copy'}
                </span>
                <span>{copiedBOM ? 'Copied to Clipboard!' : 'Copy Takeoff Summary'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print?.()}
                className="px-3.5 py-2 bg-primary text-on-primary hover:bg-primary/90 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Print Project Sheet</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 5: COMPREHENSIVE DIRECTORY - 12 USER-FRIENDLY CATEGORIES */}
        <section ref={categoriesRef} className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-surface" id="categories">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-sm">apps</span>
                  <span>Organized Directory</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                  Construction Calculators by Category
                </h2>
                <p className="mt-2 text-sm text-on-surface-variant max-w-2xl">
                  Explore organized tools across {CATEGORY_GROUPS.length} trade categories, with direct links to individual calculators and related conversion tools.
                </p>
              </div>

              {/* Category Quick Selector Pill Filter */}
              <div className="flex overflow-x-auto pb-2 gap-1.5 no-scrollbar max-w-full">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                  }`}
                >
                  All {CATEGORY_GROUPS.length} Trade Categories
                </button>
                {CATEGORY_GROUPS.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                      selectedCategoryFilter === cat.id
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map(cat => (
                <div
                  key={cat.id}
                  className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-on-surface">{cat.title}</h3>
                        <p className="text-xs text-on-surface-variant">{cat.desc}</p>
                      </div>
                    </div>

                    {/* Subcategories & Tools */}
                    <div className="space-y-4 mt-5">
                      {cat.subcategories.map((sub, sIdx) => (
                        <div key={sIdx} className="space-y-2">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary">
                            {sub.title}
                          </h4>
                          <div className="space-y-1.5">
                            {sub.tools.map((tool, tIdx) => (
                              <button
                                key={tIdx}
                                type="button"
                                onClick={() => handleToolClick(tool.targetCalculator)}
                                title={tool.description}
                                className="w-full text-left px-3 py-2 rounded-xl bg-surface-container-low/60 hover:bg-primary/10 hover:border-primary/40 border border-outline-variant/20 text-xs text-on-surface transition-all flex items-center justify-between gap-2 group cursor-pointer shadow-2xs hover:shadow-xs hover:translate-x-0.5"
                              >
                                <span className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors flex items-center gap-2 truncate">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary shrink-0 transition-colors" />
                                  <span className="truncate">{tool.name}</span>
                                </span>
                                {tool.badge && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary shrink-0">
                                    {tool.badge}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Internal Linking to Related Tools */}
                  <div className="mt-6 pt-4 border-t border-outline-variant/15">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      Related Calculation Tools:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.relatedTools.map((rel, rIdx) => (
                        <Link
                          key={rIdx}
                          href={rel.href}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-surface-container text-primary hover:bg-primary hover:text-on-primary transition-colors font-medium"
                        >
                          {rel.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTIONS 6, 7 & 8: EDUCATIONAL PILLARS, METHODOLOGY, STANDARDS, GUIDES & FAQS */}
        <EducationalSections />
      </main>
    </div>
  );
}
