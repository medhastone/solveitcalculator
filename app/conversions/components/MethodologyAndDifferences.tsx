'use client';

import React from 'react';

export default function MethodologyAndDifferences() {
  const steps = [
    {
      num: '01',
      title: 'Pick What to Measure',
      desc: 'Choose what you want to convert—like length, weight, temperature, cooking, or speed.',
    },
    {
      num: '02',
      title: 'Choose Starting & Ending Units',
      desc: 'Select your starting unit and target unit, like converting from inches to centimeters or pounds to kilograms.',
    },
    {
      num: '03',
      title: 'Type Your Number',
      desc: 'Enter any amount. The tool updates immediately and catches typos or values below absolute zero.',
    },
    {
      num: '04',
      title: 'Instant Math Formula',
      desc: 'We calculate using verified international formulas so you always get a dependable, exact result.',
    },
    {
      num: '05',
      title: 'Clear, Easy-to-Read Answer',
      desc: 'See your converted number right away with options to copy, share, or change decimal places.',
    },
  ];

  const differenceReasons = [
    {
      title: 'Rough Estimates vs. Exact Formulas',
      desc: 'Some websites use rough shortcuts like 1 kg = 2.2 lb instead of the exact standard 1 kg ≈ 2.204622 lb, which causes minor differences.',
      icon: 'calculate',
    },
    {
      title: 'US vs. British (Imperial) Sizes',
      desc: 'Units with the same name can have different sizes. A US gallon is about 3.79 liters, while a British Imperial gallon is about 4.55 liters (20% larger).',
      icon: 'water_drop',
    },
    {
      title: 'Drive Space vs. Computer Memory (GB vs. GiB)',
      desc: 'Hard drive makers count 1 GB as 1,000 Megabytes, while Windows operating systems count in 1,024 Megabytes. That is why a 1 TB drive shows about 931 GB on your PC.',
      icon: 'sd_storage',
    },
    {
      title: 'Rounding Too Early',
      desc: 'Rounding midway through a calculation creates small errors. We keep the full precision throughout and only round the final answer you see on screen.',
      icon: 'pin',
    },
  ];

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* HOW OUR UNIT CONVERTERS WORK */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs uppercase font-bold tracking-wider text-primary">
              Clear &amp; Simple
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              How Our Unit Converters Work
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Every conversion follows 5 simple steps so you can always understand your results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between space-y-2"
              >
                <div className="text-2xl font-extrabold text-primary font-mono">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-on-surface mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* References */}
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-xs text-on-surface-variant space-y-1">
            <span className="font-bold text-on-surface">Verified Standards: </span>
            <span>
              All formulas match international measurement standards (like NIST and standard metric definitions), ensuring trustworthy results for school, home, and work.
            </span>
          </div>
        </div>

        {/* WHY RESULTS MAY DIFFER */}
        <div className="space-y-6 pt-6 border-t border-outline-variant/15">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs uppercase font-bold tracking-wider text-primary">
              Accuracy &amp; Comparison
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Why Your Conversion May Differ From Another Converter
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              If another website or app gives a slightly different answer, one of these documented factors is almost always the cause:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {differenceReasons.map((reason) => (
              <div
                key={reason.title}
                className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-xl">
                    {reason.icon}
                  </span>
                  <h3 className="font-bold text-sm text-on-surface">
                    {reason.title}
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
