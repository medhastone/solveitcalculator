'use client';

import React from 'react';

export default function AstronomicalGuideSection() {
  return (
    <section className="max-w-max-width-canvas mx-auto w-full flex flex-col gap-space-md" id="astronomical-guide">
      <div>
        <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
          WHY LEAP YEARS EXIST
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
          The Earth&apos;s Orbit Around the Sun
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Why can&apos;t a year be a simple 365 days? Earth takes a little over 365 days to circle the Sun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Card 1: Solar Year Definition */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md border border-outline-variant/15">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-outline">Mean Tropical Year</span>
            <div className="font-numerical-display text-[32px] text-on-surface font-bold">365.24219</div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Mean solar days per complete orbit around the sun.
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mt-2">
              Earth takes 365 days, 5 hours, 48 minutes, and 45.2 seconds to pass between two successive vernal equinoxes.
            </p>
          </div>
          <div className="p-2 rounded bg-surface-container-low text-[12px] font-data-mono text-outline">
            Excess: +0.24219 days / year
          </div>
        </div>

        {/* Card 2: Julian Overshoot */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md border border-outline-variant/15">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-outline">Julian Formula (45 BCE)</span>
            <div className="font-numerical-display text-[32px] text-secondary font-bold">365.25000</div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Average days per year under pure 4-year leap rule.
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mt-2">
              Overshoots the true orbit by 11 minutes and 14.8 seconds each year, accumulating 1 full superfluous day every 128 years.
            </p>
          </div>
          <div className="p-2 rounded bg-surface-container-low text-[12px] font-data-mono text-error">
            Error: +1 day every 128 years
          </div>
        </div>

        {/* Card 3: Gregorian Precision */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md border border-outline-variant/15">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-outline">Gregorian Reform (1582 CE)</span>
            <div className="font-numerical-display text-[32px] text-primary font-bold">365.24250</div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Omits 3 leap days every 400 years (−0.0075d).
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mt-2">
              Brings the annual discrepancy down to just 26.8 seconds per year. The Gregorian calendar will require no manual adjustment for 3,236 years.
            </p>
          </div>
          <div className="p-2 rounded bg-surface-container-low text-[12px] font-data-mono text-primary font-semibold">
            Accuracy: 99.9992% aligned
          </div>
        </div>
      </div>

      {/* Chronological Milestones Timeline */}
      <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-lg flex flex-col gap-space-md border border-outline-variant/20">
        <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
          Historical Calendar Evolution
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md relative">
          <div className="flex flex-col gap-1 p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
            <span className="font-data-mono text-body-sm font-bold text-primary">753 BCE – 46 BCE</span>
            <span className="font-body-md text-body-md font-bold text-on-surface">Ancient Roman Calendar</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Only 10 months and 304 days. Officials added irregular leap months by hand, which threw calendars off by months.
            </p>
          </div>

          <div className="flex flex-col gap-1 p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
            <span className="font-data-mono text-body-sm font-bold text-primary">45 BCE</span>
            <span className="font-body-md text-body-md font-bold text-on-surface">Julian Calendar Reform</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Julius Caesar created a straightforward 365-day calendar with one extra day every 4 years in February.
            </p>
          </div>

          <div className="flex flex-col gap-1 p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
            <span className="font-data-mono text-body-sm font-bold text-primary">1582 CE</span>
            <span className="font-body-md text-body-md font-bold text-on-surface">Gregorian Calendar Reform</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Pope Gregory XIII skipped 10 drifted days and added the rule to skip 3 century leap years every 400 years.
            </p>
          </div>

          <div className="flex flex-col gap-1 p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
            <span className="font-data-mono text-body-sm font-bold text-primary">1988 – Present</span>
            <span className="font-body-md text-body-md font-bold text-on-surface">
              Modern Global Calendar (Everyday Standard)
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Used worldwide by international agreements, phones, computers, and everyday life in standard YYYY-MM-DD format.
            </p>
          </div>
        </div>

        {/* Authoritative Scientific & Astronomical References */}
        <div className="mt-space-sm p-space-md rounded-xl bg-surface-container-low/70 border border-outline-variant/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </div>
            <div>
              <h4 className="font-body-md text-body-md font-bold text-on-surface">
                Authoritative Chronometry &amp; Astronomical Standards
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Explore official astronomical calculation models and historical calendar reform archives maintained by global observatories.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
            <a
              href="https://eclipse.gsfc.nasa.gov/SEhelp/calendars.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-primary font-body-sm text-body-sm font-medium border border-outline-variant/20 shadow-xs transition-colors"
            >
              <span>NASA Calendar Ephemeris Guide</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
            <a
              href="https://www.rmg.co.uk/stories/topics/which-years-are-leap-years-can-you-have-leap-seconds"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-primary font-body-sm text-body-sm font-medium border border-outline-variant/20 shadow-xs transition-colors"
            >
              <span>Royal Museums Greenwich History</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
