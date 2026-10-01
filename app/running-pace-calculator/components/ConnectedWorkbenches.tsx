import React from 'react';
import Link from 'next/link';

const WORKBENCHES = [
  {
    title: 'BMI & Body Composition Calculator',
    desc: 'Calculate exact Body Mass Index, body fat percentages, and healthy weight ranges.',
    href: '/bmi-calculator',
    icon: 'accessibility_new',
  },
  {
    title: 'Speed & Velocity Converter',
    desc: 'Convert speed seamlessly between km/h, mph, knots, m/s, and pacing metrics.',
    href: '/speed-converter',
    icon: 'speed',
  },
  {
    title: 'Distance & Length Converter',
    desc: 'Metrological conversion between kilometers, miles, meters, feet, and nautical leagues.',
    href: '/length-converter',
    icon: 'straighten',
  },
  {
    title: 'Time & Date Duration Calculator',
    desc: 'Add, subtract, and calculate exact time deltas down to seconds and milliseconds.',
    href: '/time-date',
    icon: 'schedule',
  },
  {
    title: 'Focus & Interval Workout Timer',
    desc: 'High-precision interval timers for Tabata, HIIT, running laps, and endurance rests.',
    href: '/focus-and-break-timer',
    icon: 'timer',
  },
  {
    title: 'Health & Fitness Category Hub',
    desc: 'Explore all physiological, metabolic, caloric, and cardiovascular calculators.',
    href: '/health-fitness',
    icon: 'cardiology',
  },
];

export default function ConnectedWorkbenches() {
  return (
    <section className="w-full py-space-lg bg-surface border-t border-surface-container">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">hub</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Connected Physiological &amp; Kinetic Workbenches
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Seamlessly jump to complementary health, physical conversion, and timing tools across
            SolveIt.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-sm">
          {WORKBENCHES.map((tool, idx) => (
            <Link
              key={idx}
              href={tool.href}
              className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs hover:border-primary hover:shadow-sm transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors mb-space-xs">
                  <span className="material-symbols-outlined text-[20px]">{tool.icon}</span>
                </div>
                <h3 className="font-title-sm text-title-sm font-bold text-on-surface group-hover:text-primary transition-colors mb-1">
                  {tool.title}
                </h3>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">
                  {tool.desc}
                </p>
              </div>
              <div className="pt-2 mt-3 border-t border-surface-container flex items-center gap-1 text-[12px] font-semibold text-primary">
                <span>Launch Tool</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
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
