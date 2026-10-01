'use client';

import React, { useState, useMemo } from 'react';
import {
  FINANCE_CATALOG,
  FinanceTool,
} from './financeData';
import FinanceHero from './components/FinanceHero';
import PopularFinanceCalculators from './components/PopularFinanceCalculators';
import FinanceGoals from './components/FinanceGoals';
import ScenarioComparison from './components/ScenarioComparison';
import FinancialQuestions from './components/FinancialQuestions';
import FinanceCategories from './components/FinanceCategories';
import RegionalAndTaxTrust from './components/RegionalAndTaxTrust';
import FinanceEducationAndGuides from './components/FinanceEducationAndGuides';
import FinanceFaqAndDisclaimer from './components/FinanceFaqAndDisclaimer';

// Export for backwards compatibility if needed
export const FINANCE_TOOLS_CATALOG = FINANCE_CATALOG;
export type { FinanceTool as FinanceToolItem };

export default function FinanceHubClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Filtered tools based on search query
  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return FINANCE_CATALOG.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchCategory = tool.category.toLowerCase().includes(q);
      const matchKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchName || matchDesc || matchCategory || matchKeywords;
    });
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-surface text-on-surface antialiased">
      {/* 1st & 2nd: Breadcrumb, H1 Title, and Subheading Summary */}
      <FinanceHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        filteredTools={filteredTools}
      />

      {/* 3rd: Live Interactive Dashboard / Scenario Comparison Engine */}
      <ScenarioComparison selectedCurrency={selectedCurrency} />

      {/* 4th: Tools Category Directory & Popular Calculators with Search Filter */}
      <FinanceCategories />
      <PopularFinanceCalculators />

      {/* 5th: Goal-Based Discovery, Reference Documentation, Educational Guides & FAQs */}
      <FinanceGoals />
      <FinancialQuestions />
      <RegionalAndTaxTrust />
      <FinanceEducationAndGuides />
      <FinanceFaqAndDisclaimer />
    </main>
  );
}
