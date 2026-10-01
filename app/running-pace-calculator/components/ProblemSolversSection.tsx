import React from 'react';

interface ProblemSolversSectionProps {
  onSelectQuery: (distKm: number, hours: number, mins: number, secs: number) => void;
}

const QUERIES = [
  {
    title: 'Sub-20 Minute 5K',
    desc: 'Elite amateur threshold requiring 4:00/km (6:26/mile) pace.',
    distKm: 5,
    h: 0,
    m: 20,
    s: 0,
    pace: '4:00 /km',
  },
  {
    title: 'Sub-25 Minute 5K',
    desc: 'Popular milestone for competitive recreational road runners.',
    distKm: 5,
    h: 0,
    m: 25,
    s: 0,
    pace: '5:00 /km',
  },
  {
    title: 'Sub-45 Minute 10K',
    desc: 'Requires steady threshold holding 4:30/km (7:15/mile) for 10 kilometers.',
    distKm: 10,
    h: 0,
    m: 45,
    s: 0,
    pace: '4:30 /km',
  },
  {
    title: 'Sub-50 Minute 10K',
    desc: 'Benchmark standard of solid endurance requiring 5:00/km exact pacing.',
    distKm: 10,
    h: 0,
    m: 50,
    s: 0,
    pace: '5:00 /km',
  },
  {
    title: 'Sub-1:45 Half Marathon',
    desc: 'Intermediate distance benchmark requiring 4:58/km (8:00/mile).',
    distKm: 21.0975,
    h: 1,
    m: 45,
    s: 0,
    pace: '4:58 /km',
  },
  {
    title: 'Sub-2:00 Half Marathon',
    desc: 'The most chased half-marathon milestone requiring 5:41/km (9:09/mile).',
    distKm: 21.0975,
    h: 2,
    m: 0,
    s: 0,
    pace: '5:41 /km',
  },
  {
    title: 'Sub-3:00 Marathon (BQ)',
    desc: 'Prestigious Boston Qualifier benchmark demanding 4:15/km (6:52/mile).',
    distKm: 42.195,
    h: 3,
    m: 0,
    s: 0,
    pace: '4:15 /km',
  },
  {
    title: 'Sub-4:00 Marathon',
    desc: 'Premier bucket-list achievement demanding sustained 5:41/km (9:09/mile).',
    distKm: 42.195,
    h: 4,
    m: 0,
    s: 0,
    pace: '5:41 /km',
  },
];

export default function ProblemSolversSection({ onSelectQuery }: ProblemSolversSectionProps) {
  return (
    <section className="w-full py-space-lg bg-surface border-t border-surface-container">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">troubleshoot</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Popular Runner Target Pace Solvers
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Click any milestone target to instantly populate and calibrate the entire workbench with
            precise splits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
          {QUERIES.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectQuery(q.distKm, q.h, q.m, q.s)}
              className="bg-surface-container-lowest p-space-sm rounded-xl border border-surface-container shadow-xs text-left hover:border-primary hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-title-sm text-title-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {q.title}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[18px] transition-transform group-hover:translate-x-0.5">
                    arrow_forward
                  </span>
                </div>
                <p className="text-[12px] text-on-surface-variant leading-relaxed mb-3">
                  {q.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  Pace Needed:
                </span>
                <span className="font-mono text-[13px] font-bold text-primary">
                  {q.pace}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
