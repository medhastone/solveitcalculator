'use client';

import React from 'react';
import { BookOpen, Check, HelpCircle, Layers, Sliders } from 'lucide-react';

export default function DateEducationSection() {
  return (
    <div className="space-y-16 py-12 bg-surface-container-low border-y border-outline-variant/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* SECTION 11: HOW ARE DAYS COUNTED? */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Counting Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              How Are Days Counted?
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              Choosing the correct convention prevents off-by-one errors in contracts, leases, and milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs">
              <h3 className="text-base font-bold text-on-surface mb-2">Exclusive Count</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-3">
                The starting date is not counted (e.g. from Monday to Tuesday is exactly 1 day). This is standard for
                elapsed time, age, and interest calculations.
              </p>
              <div className="text-xs font-mono bg-surface-container p-2 rounded text-on-surface">
                Monday → Wednesday = 2 days
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs">
              <h3 className="text-base font-bold text-on-surface mb-2">Inclusive Count</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-3">
                Both the starting boundary and ending boundary dates are counted. Standard for hotel reservations,
                rental periods, and conference passes.
              </p>
              <div className="text-xs font-mono bg-surface-container p-2 rounded text-on-surface">
                Monday → Wednesday = 3 days
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs">
              <h3 className="text-base font-bold text-on-surface mb-2">Business-Day Count</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-3">
                Only designated working days are evaluated. Weekends (e.g., Saturday &amp; Sunday) and configured public
                or statutory holidays are excluded.
              </p>
              <div className="text-xs font-mono bg-surface-container p-2 rounded text-on-surface">
                Friday → Tuesday = 2 workdays
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs">
              <h3 className="text-base font-bold text-on-surface mb-2">Calendar Duration</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-3">
                Expresses the interval in full calendar years, months, and remaining days, honoring the varying lengths of
                each specific month in the span.
              </p>
              <div className="text-xs font-mono bg-surface-container p-2 rounded text-on-surface">
                1 year, 2 months, 14 days
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 12 & 13: MONTH-END & LEAP YEAR HANDLING */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40">
            <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight mb-3">
              How Month-End Dates Are Handled
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
              Months have different lengths (28, 29, 30, or 31 days), so adding a calendar month produces different
              results from adding a fixed 30-day block.
            </p>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
              When a target month has fewer days than the starting day (for example, adding 1 month to <strong>January 31</strong>),
              our calculator pins the result to the last valid calendar day of that month (<strong>February 28</strong>, or <strong>February 29</strong> in a leap year).
            </p>
            <div className="p-3 bg-surface-container rounded-xl text-xs text-on-surface space-y-1">
              <div>• <strong>Jan 31 + 1 month</strong> = Feb 28 (or Feb 29 in leap year)</div>
              <div>• <strong>Feb 29 + 1 year</strong> = Feb 28 of the following common year</div>
              <div>• <strong>Aug 31 - 1 month</strong> = Jul 31</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40">
            <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight mb-3">
              Gregorian Leap Year Handling
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
              A standard calendar year is 365 days, but Earth takes approximately 365.2422 days to orbit the Sun.
              The Gregorian calendar synchronizes astronomical seasons using precise rules:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant mb-4">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Every year divisible by <strong>4</strong> is a leap year (e.g. 2024, 2028).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>Century exception:</strong> Years divisible by 100 are NOT leap years (e.g. 1900, 2100).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>400-year rule:</strong> Years divisible by 400 ARE leap years (e.g. 2000, 2400).</span>
              </li>
            </ul>
            <p className="text-xs text-on-surface-variant italic">
              All SolveItCalculator engines calculate chronological age and date differences using this rule.
            </p>
          </div>
        </section>

        {/* SECTION 26: WHY DATE RESULTS CAN DIFFER */}
        <section className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/40">
          <div className="max-w-3xl mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
              Why Date Results Can Differ
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
              If you compare results between different calculators or spreadsheet software, slight variances often occur
              due to differing underlying assumptions. Here is why:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <h3 className="font-bold text-on-surface mb-1">Inclusive vs. Exclusive</h3>
              <p className="text-on-surface-variant">
                Whether the starting or ending boundary day is included alters total days by exactly 1.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <h3 className="font-bold text-on-surface mb-1">Month-End Pinning</h3>
              <p className="text-on-surface-variant">
                Some software rolls January 31 + 1 month into March 2 or 3, whereas we pin to February 28/29.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <h3 className="font-bold text-on-surface mb-1">Regional Holiday Lists</h3>
              <p className="text-on-surface-variant">
                Public holidays differ substantially between the US, UK, Canada, Australia, and other jurisdictions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <h3 className="font-bold text-on-surface mb-1">Time Zone &amp; Rollover</h3>
              <p className="text-on-surface-variant">
                A date change across midnight in one time zone may still be the previous date elsewhere in the world.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <h3 className="font-bold text-on-surface mb-1">Daylight Saving Transitions</h3>
              <p className="text-on-surface-variant">
                A single 24-hour day may have 23 or 25 clock hours during spring forward or fall back shifts.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <h3 className="font-bold text-on-surface mb-1">Date-Only vs. Timestamp</h3>
              <p className="text-on-surface-variant">
                Date-only tools treat each day as an intact unit, avoiding fractional day discrepancies.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 27: HOW OUR CALCULATORS WORK */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Clear Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
              How Our Time &amp; Date Calculators Work
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              Every tool follows a structured, transparent 6-step calculation method.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Identify Range',
                desc: 'Parse and validate start dates, target dates, or clock times against Gregorian calendar rules.',
              },
              {
                step: '02',
                title: 'Apply Convention',
                desc: 'Enforce your chosen counting convention (exclusive vs. inclusive boundary dates).',
              },
              {
                step: '03',
                title: 'Apply Workday Rules',
                desc: 'Where applicable, filter dates against your configured workweek and selected holiday schedules.',
              },
              {
                step: '04',
                title: 'Apply Timezone Rules',
                desc: 'Incorporate IANA local offsets and daylight saving transitions for clock arithmetic.',
              },
              {
                step: '05',
                title: 'Calculate Result',
                desc: 'Compute the exact calendar delta, duration, shift total, or countdown interval.',
              },
              {
                step: '06',
                title: 'Display Assumptions',
                desc: 'Clearly disclose counting conventions, breakdown units, and formulas alongside the result.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs"
              >
                <div className="text-xs font-mono font-bold text-primary mb-2">STEP {s.step}</div>
                <h3 className="text-base font-bold text-on-surface mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
