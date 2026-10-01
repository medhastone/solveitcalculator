import React from 'react';
import Link from 'next/link';

export default function RelatedMathCategories() {
  const hubs = [
    {
      title: 'Financial Calculators',
      desc: 'Compound interest, mortgage payments, auto loans, investment growth, and inflation calculations.',
      icon: 'attach_money',
      path: '/finance',
      badge: 'Money & Wealth',
    },
    {
      title: 'Health & Fitness Calculators',
      desc: 'BMI, BMR calorie burn, TDEE maintenance, body fat percentage, and macro targets.',
      icon: 'monitor_heart',
      path: '/health-fitness-calculators',
      badge: 'Body & Nutrition',
    },
    {
      title: 'Unit Conversion Tools',
      desc: 'Accurate metric to imperial conversions for length, mass, temperature, speed, area, and volume.',
      icon: 'sync_alt',
      path: '/conversion',
      badge: 'Measurement',
    },
    {
      title: 'Scientific Calculator',
      desc: 'Advanced scientific arithmetic, trigonometry, logarithms, powers, and scientific notation.',
      icon: 'calculate',
      path: '/scientific-calculator',
      badge: 'Core Tool',
    },
  ];

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Connected Disciplines
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Related Problem Solving Hubs
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Explore related calculation centers across finance, health, and unit conversion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hubs.map((hub) => (
            <Link
              key={hub.title}
              href={hub.path}
              className="group p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">{hub.icon}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    {hub.badge}
                  </span>
                </div>

                <h3 className="font-bold text-on-surface text-base group-hover:text-primary transition-colors mb-1.5">
                  {hub.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {hub.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Explore Hub</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
