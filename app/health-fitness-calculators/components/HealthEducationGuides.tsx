import React from 'react';
import Link from 'next/link';
import { HEALTH_CALCULATION_GUIDES } from '../healthCategoryData';

export default function HealthEducationGuides() {
  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Evidence-Based Education
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Health &amp; Fitness Calculation Guides
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            In-depth guides explaining how physiological formulas work, what their numbers indicate, and how to interpret results without misdiagnosing yourself.
          </p>
        </div>

        {/* Highlighted Conceptual Deep Dives: BMI and BMR vs TDEE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deep Dive 1: BMI */}
          <div className="p-6 sm:p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-base">info</span>
                Measurement Context
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">
                What Does Body Mass Index (BMI) Actually Measure?
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                Developed in the 19th century by mathematician Adolphe Quetelet, BMI calculates the ratio of total body weight in kilograms divided by height in meters squared (kg/m²). It is categorized by public health organizations as an epidemiological <strong>population screening metric</strong>.
              </p>
              <div className="space-y-2 text-xs text-on-surface-variant border-l-2 border-primary/40 pl-3.5 mb-4">
                <p>
                  <strong>What BMI does:</strong> Identifies statistical risk correlations across large populations for underweight, normal weight, overweight, and obesity.
                </p>
                <p>
                  <strong>What BMI does not do:</strong> It cannot distinguish between metabolically active skeletal muscle mass and adipose tissue, nor does it measure bone mineral density or visceral abdominal fat.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant/70">Screening Tool Reference</span>
              <Link
                href="/health-fitness-calculators/bmi"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Open BMI Calculator
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Deep Dive 2: BMR vs TDEE */}
          <div className="p-6 sm:p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-base">local_fire_department</span>
                Metabolic Balance
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">
                The Distinction Between BMR and TDEE
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                Caloric planning requires understanding the two core layers of human energy expenditure: your baseline metabolic floor and your active daily lifestyle.
              </p>
              <div className="space-y-2 text-xs text-on-surface-variant border-l-2 border-primary/40 pl-3.5 mb-4">
                <p>
                  <strong>Basal Metabolic Rate (BMR):</strong> The exact energy in calories required to keep your heart pumping, lungs breathing, kidneys filtering, and brain functioning at total physical and digestive rest (~60–70% of total energy).
                </p>
                <p>
                  <strong>Total Daily Energy Expenditure (TDEE):</strong> BMR multiplied by your physical activity factor, including deliberate exercise, spontaneous fidgeting (NEAT), and the thermic effect of food (TEF).
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant/70">Energy Expenditure Tools</span>
              <div className="flex items-center gap-3">
                <Link
                  href="/health-fitness-calculators/bmr"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  BMR Tool
                </Link>
                <span className="text-outline-variant/40">•</span>
                <Link
                  href="/health-fitness-calculators/tdee"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  TDEE Tool
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-on-surface">
              Explore All Calculation Guides
            </h3>
            <span className="text-xs text-on-surface-variant/70">
              {HEALTH_CALCULATION_GUIDES.length} Educational Articles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HEALTH_CALCULATION_GUIDES.map((guide) => (
              <div
                key={guide.title}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/25 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant/80 mb-2">
                    <span className="font-medium text-primary">{guide.toolName}</span>
                    <span>{guide.readTime}</span>
                  </div>
                  <h4 className="font-bold text-on-surface text-sm sm:text-base mb-2">
                    {guide.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                    {guide.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-outline-variant/15 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant/70">Related Tool:</span>
                  <Link
                    href={guide.toolPath}
                    className="font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    Open Tool
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
