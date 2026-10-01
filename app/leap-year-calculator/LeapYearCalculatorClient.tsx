'use client';

import React, { useState, useMemo } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroAndChecker from './components/HeroAndChecker';
import DecisionTreeSection from './components/DecisionTreeSection';
import CycleWorkbenchSection from './components/CycleWorkbenchSection';
import RangeCalculatorSection from './components/RangeCalculatorSection';
import HistoricalComparisonSection from './components/HistoricalComparisonSection';
import AstronomicalGuideSection from './components/AstronomicalGuideSection';
import QuizAndFactsSection from './components/QuizAndFactsSection';
import DeveloperReferenceSection from './components/DeveloperReferenceSection';
import FaqSection from './components/FaqSection';
import RelatedToolsSection from './components/RelatedToolsSection';
import { checkLeap } from './utils';

export default function LeapYearCalculatorClient() {
  const [currentYear, setCurrentYear] = useState<number>(2028);
  const [inputVal, setInputVal] = useState<string>('2028');

  const evaluation = useMemo(() => {
    return checkLeap(currentYear);
  }, [currentYear]);

  const handleEvaluate = (year: number) => {
    setCurrentYear(year);
    setInputVal(String(year));
  };

  const handleSelectAndScroll = (year: number) => {
    setCurrentYear(year);
    setInputVal(String(year));
    if (typeof window !== 'undefined') {
      const el = document.getElementById('leap-year-checker');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSurpriseMe = () => {
    const randomYear = Math.floor(Math.random() * (2400 - 1800 + 1)) + 1800;
    setCurrentYear(randomYear);
    setInputVal(String(randomYear));
  };

  return (
    <main className="w-full pt-0 pb-20 bg-surface min-h-screen">
      <div className="flex flex-col w-full">
        {/* Top Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Time & Date Calculators', href: '/time-date' },
            { label: 'Leap Year Calculator' },
          ]}
          badge="400-Year Gregorian Standard"
          rightContent={
            <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-medium border border-outline-variant/20 shadow-xs">
              100% In-Browser &amp; Private
            </span>
          }
        />

        {/* Canvas Container (Max 1280px) */}
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop w-full py-space-md flex flex-col gap-space-2xl">
          {/* Section 1: Hero & Primary Interactive Checker */}
          <HeroAndChecker
            inputVal={inputVal}
            setInputVal={setInputVal}
            evaluation={evaluation}
            onEvaluate={handleEvaluate}
            onSurpriseMe={handleSurpriseMe}
          />

          {/* Section 2: Visual Decision Tree & Historical Rule Contrast */}
          <DecisionTreeSection evaluation={evaluation} />

          {/* Section 3: 400-Year Gregorian Cycle Workbench & Interactive Heatmap */}
          <CycleWorkbenchSection onSelectYear={handleSelectAndScroll} />

          {/* Section 4: Range Calculator & Leap Year List Generator */}
          <RangeCalculatorSection onSelectYear={handleSelectAndScroll} />

          {/* Section 5: Gregorian vs. Julian Comparison & Proleptic Warning */}
          <HistoricalComparisonSection />

          {/* Section 6: Astronomical Guide & Solar Year Alignment */}
          <AstronomicalGuideSection />

          {/* Section 7: Interactive Mini-Quiz & Fascinating Facts */}
          <QuizAndFactsSection />

          {/* Section 8: Developer Reference & Pseudocode Tabs */}
          <DeveloperReferenceSection />

          {/* Section 9: Comprehensive FAQ Accordion */}
          <FaqSection />

          {/* Section 10: Related Precision Time Tools */}
          <RelatedToolsSection />
        </div>
      </div>
    </main>
  );
}
