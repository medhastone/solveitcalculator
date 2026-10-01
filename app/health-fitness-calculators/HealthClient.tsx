'use client';

import React from 'react';
import HealthHero from './components/HealthHero';
import PopularHealthCalculators from './components/PopularHealthCalculators';
import HealthGoals from './components/HealthGoals';
import FeaturedHealthCalculators from './components/FeaturedHealthCalculators';
import HealthCategories from './components/HealthCategories';
import HowHealthCalculatorsWork from './components/HowHealthCalculatorsWork';
import HealthAccuracyAndDifferences from './components/HealthAccuracyAndDifferences';
import HealthEducationGuides from './components/HealthEducationGuides';
import HealthMethodsAndSources from './components/HealthMethodsAndSources';
import HealthFaqAndDisclaimer from './components/HealthFaqAndDisclaimer';

export default function HealthClient() {
  return (
    <main className="min-h-screen bg-surface text-on-surface">
      {/* 1. Hero with Breadcrumb (1st) & H1 Title/Subheading (2nd) */}
      <HealthHero />

      {/* 2. Featured Health Calculators (3rd: Live Interactive Dashboard) */}
      <FeaturedHealthCalculators />

      {/* 3. Popular Health Calculators (4th: Tools Category & Tool Pages) */}
      <PopularHealthCalculators />

      {/* 4. Goal-Based Discovery */}
      <HealthGoals />

      {/* 5. Health Calculators by Category (Organized Domains) */}
      <HealthCategories />

      {/* 6. Differentiated Experience: Calculate -> Understand -> Explore */}
      <HowHealthCalculatorsWork />

      {/* 7. Measurement Nuance: How Accurate & Why Results May Differ */}
      <HealthAccuracyAndDifferences />

      {/* 8. Educational Guides & Deep Dives (BMI, BMR vs TDEE, etc.) */}
      <HealthEducationGuides />

      {/* 9. Mathematical Methods, Formulas & Public Health Sources */}
      <HealthMethodsAndSources />

      {/* 10. FAQs, Privacy-Conscious Notice & Medical Disclaimer */}
      <HealthFaqAndDisclaimer />
    </main>
  );
}
