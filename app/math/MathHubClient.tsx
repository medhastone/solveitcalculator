'use client';

import React from 'react';
import MathHero from './components/MathHero';
import PopularMathTools from './components/PopularMathTools';
import SolverModes from './components/SolverModes';
import MathGoals from './components/MathGoals';
import MathCategories from './components/MathCategories';
import MathCalculatorFinder from './components/MathCalculatorFinder';
import InteractiveMathVisuals from './components/InteractiveMathVisuals';
import MathFormulaLibrary from './components/MathFormulaLibrary';
import QuickMathAnswers from './components/QuickMathAnswers';
import MathConceptComparisons from './components/MathConceptComparisons';
import MathLearningPathAndExams from './components/MathLearningPathAndExams';
import MathEducationGuides from './components/MathEducationGuides';
import MathMethodologyAndDifferences from './components/MathMethodologyAndDifferences';
import MathFaqSection from './components/MathFaqSection';
import RelatedMathCategories from './components/RelatedMathCategories';

export default function MathHubClient() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* 1st & 2nd: Breadcrumb, H1 Title, and Subheading Summary */}
      <MathHero />

      {/* 3rd: Live Interactive Dashboard (Unit Circle, Function Graph, Normal Curve) */}
      <InteractiveMathVisuals />

      {/* 4th: Category Search Filter & Tools Category Catalog */}
      <MathCalculatorFinder />
      <MathCategories />
      <PopularMathTools />

      {/* 5th: Mathematical Formula Library, Worked Proofs, Educational Guides & FAQs */}
      <SolverModes />
      <MathGoals />
      <MathFormulaLibrary />
      <QuickMathAnswers />
      <MathConceptComparisons />
      <MathLearningPathAndExams />
      <MathEducationGuides />
      <MathMethodologyAndDifferences />
      <MathFaqSection />
      <RelatedMathCategories />
    </div>
  );
}
