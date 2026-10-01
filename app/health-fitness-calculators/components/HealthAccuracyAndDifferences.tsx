import React from 'react';

export default function HealthAccuracyAndDifferences() {
  const accuracyFactors = [
    {
      title: 'Formula Assumptions & Sample Cohorts',
      icon: 'science',
      desc: 'Health equations are derived from statistical regressions over specific research populations. For example, the Mifflin-St Jeor BMR equation predicts resting energy expenditure within ±10% for approximately 82% of non-obese individuals, but individual metabolic variance remains.',
    },
    {
      title: 'Measurement Precision & Input Error',
      icon: 'straighten',
      desc: 'Circumference-based calculations (like the Navy Body Fat method) are sensitive to tape positioning and tension. A 1-centimeter deviation in neck or waist measurement can shift estimated body fat by 1.5% to 2.5%.',
    },
    {
      title: 'Biological & Musculoskeletal Diversity',
      icon: 'diversity_3',
      desc: 'Formulas typically use gross body weight and stature. They cannot directly measure skeletal bone density, organ weight, hydration shifts, or muscle mass distribution without clinical imaging.',
    },
    {
      title: 'Dynamic Metabolic Adaptation',
      icon: 'autorenew',
      desc: 'During calorie restriction, the body adapts by lowering non-exercise activity thermogenesis (NEAT) and increasing mitochondrial efficiency. Static energy formulas do not automatically adjust for adaptive thermogenesis over time.',
    },
  ];

  const differenceReasons = [
    {
      factor: 'Underlying Formula Choice',
      example: 'Mifflin-St Jeor vs. Harris-Benedict (1984 rev.) vs. Katch-McArdle',
      impact: 'Different BMR formulas can diverge by 50 to 180 kcal/day for the exact same person.',
    },
    {
      factor: 'Physical Activity Level (PAL) Multipliers',
      example: 'Sedentary (1.2) vs Light (1.375) vs Moderate (1.55)',
      impact: 'Disagreement on activity definitions between apps can alter calculated TDEE by 250–500 kcal/day.',
    },
    {
      factor: 'Reference Population Cutoffs',
      example: 'Standard WHO BMI (18.5–24.9) vs. WHO South Asian cutoffs (18.5–22.9)',
      impact: 'The exact same BMI of 23.5 is categorized as "Normal" under global criteria and "Overweight / Increased Risk" under Asian criteria.',
    },
    {
      factor: 'Heart Rate Max Estimation Methods',
      example: 'Tanaka formula: 208 - (0.7 × Age) vs. Traditional: 220 - Age',
      impact: 'For a 50-year-old athlete, Tanaka estimates max HR at 173 BPM while 220-Age estimates 170 BPM.',
    },
    {
      factor: 'Menstrual Cycle Assumptions in Due Dates',
      example: 'Standard 28-day cycle vs. personal 24–35 day cycles',
      impact: 'Due date calculators that do not collect cycle length assume standard 28-day cycles, potentially skewing EDD by up to a full week.',
    },
  ];

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section 1: How Accurate Are Health Calculators? */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Measurement Nuance
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              How Accurate Are Health Calculators?
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              Online wellness calculators provide valuable baseline estimates, but their precision depends on mathematical assumptions, measurement accuracy, and individual physiology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {accuracyFactors.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-2xl bg-surface border border-outline-variant/30 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-base mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Why Your Result May Differ */}
        <div className="pt-12 border-t border-outline-variant/20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Comparative Analysis
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Why Your Result May Differ From Another Calculator
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              If two websites give you different numbers for calories, body fat, or heart rate zones, here is why:
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-outline-variant/30 bg-surface shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface-container-low/70 border-b border-outline-variant/20 text-on-surface font-semibold">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Divergence Factor</th>
                  <th className="py-3.5 px-4 sm:px-6">Examples in Practice</th>
                  <th className="py-3.5 px-4 sm:px-6">Typical Variance Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 text-on-surface-variant">
                {differenceReasons.map((row) => (
                  <tr key={row.factor} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-on-surface">
                      {row.factor}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-xs">
                      {row.example}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      {row.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
