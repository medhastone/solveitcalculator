import React from 'react';

export default function HowHealthCalculatorsWork() {
  const steps = [
    {
      step: '01',
      title: 'CALCULATE',
      badge: 'Input & Processing',
      icon: 'calculate',
      description:
        'Enter your information into client-side input fields. The tool applies documented mathematical formulas directly in your browser without saving personal data.',
      points: [
        'Metric and imperial unit support',
        'Validated numerical input constraints',
        'Instantaneous client-side computation',
      ],
    },
    {
      step: '02',
      title: 'UNDERSTAND',
      badge: 'Formulas & Limitations',
      icon: 'menu_book',
      description:
        'Examine the underlying scientific formula, reference populations, and assumptions behind your result, including what the number does and does not mean.',
      points: [
        'Transparent mathematical equations',
        'Stated assumptions and baseline variables',
        'Clear clinical and observational limitations',
      ],
    },
    {
      step: '03',
      title: 'EXPLORE',
      badge: 'Guides & Context',
      icon: 'explore',
      description:
        'Cross-reference related calculators, examine sensitivity ranges, and review educational guides to place estimates in practical wellness context.',
      points: [
        'Multi-tool goal workflows',
        'Educational physiological guides',
        'Direct links to peer-reviewed sources',
      ],
    },
  ];

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Methodology
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            How Health Calculators Work
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            A three-step approach designed to provide transparent, informative, and responsible wellness calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 sm:p-7 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <span className="font-mono text-2xl font-bold text-outline-variant/40">
                    {item.step}
                  </span>
                </div>

                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                  {item.badge}
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-2.5">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-5">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-outline-variant/15 space-y-2">
                {item.points.map((pt) => (
                  <div key={pt} className="flex items-center gap-2 text-xs text-on-surface">
                    <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
