'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Briefcase,
  Building2,
  Globe,
  Hourglass,
  Terminal,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { CATEGORY_GROUPS, ALL_TOOLS_CATALOG, ToolItem } from '../data/timeDateData';

export default function CategorySections() {
  const dateTools = ALL_TOOLS_CATALOG.filter((t) => t.category === 'Date Calculations' || t.category === 'Age & Birthdays');
  const timeTools = ALL_TOOLS_CATALOG.filter((t) => t.category === 'Time Calculations');
  const workTools = ALL_TOOLS_CATALOG.filter((t) => t.category === 'Work & Payroll');
  const businessDaysTools = ALL_TOOLS_CATALOG.filter((t) => t.category === 'Business Days');
  const timezoneTools = ALL_TOOLS_CATALOG.filter((t) => t.category === 'Time Zones');
  const countdownTools = ALL_TOOLS_CATALOG.filter((t) => t.category === 'Countdowns' || t.id === 'birthday-tracker');
  const advancedTools = ALL_TOOLS_CATALOG.filter((t) => t.category === 'Advanced Calendar');

  const renderToolGrid = (tools: ToolItem[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <Link
          key={tool.id}
          href={tool.anchor}
          className="group bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 hover:border-primary/50 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                {tool.badge}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                {tool.category}
              </span>
            </div>
            <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors mb-1">
              {tool.name}
            </h4>
            <p className="text-xs text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">
              {tool.desc}
            </p>
          </div>
          <div className="flex items-center text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
            <span>Calculate</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div id="catalog-section" className="space-y-16 py-12">
      {/* SECTION 7: DATE CALCULATORS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Date Calculators
          </h2>
        </div>
        <p className="text-sm sm:text-base text-on-surface-variant mb-6 max-w-3xl">
          Count the exact number of calendar days between dates, determine chronological age with leap-year awareness,
          and add or subtract arbitrary date offsets using documented calendar arithmetic.
        </p>
        {renderToolGrid(dateTools)}
      </section>

      {/* SECTION 8: TIME CALCULATORS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Time Calculators
          </h2>
        </div>
        <p className="text-sm sm:text-base text-on-surface-variant mb-6 max-w-3xl">
          Calculate and convert hours, minutes, seconds, durations, timestamps, and 24-hour military clock values.
          Handles automatic unit carry-over and decimal payroll increments.
        </p>
        {renderToolGrid(timeTools)}
      </section>

      {/* SECTION 9: WORK, SHIFT & PAYROLL */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Work, Shift &amp; Payroll Calculators
          </h2>
        </div>
        <p className="text-sm sm:text-base text-on-surface-variant mb-6 max-w-3xl">
          Calculate scheduled work time, unpaid lunch breaks, overtime hours, billable increments, and focused productivity
          cycles based on your selected shift schedule.
        </p>
        {renderToolGrid(workTools)}
      </section>

      {/* SECTION 10: BUSINESS DAYS & WORKDAYS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-container-low p-6 sm:p-8 rounded-3xl border border-outline-variant/40">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Business Days &amp; Workday Calculators
            </h2>
          </div>
          <p className="text-sm sm:text-base text-on-surface-variant mb-6 max-w-3xl">
            Count business days between two dates or determine future project deadlines. Customize your workweek
            (Monday–Friday, Monday–Saturday, or custom) and exclude public holidays or specific company non-working days.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <h3 className="text-sm font-bold text-on-surface mb-1">Custom Workweeks</h3>
              <p className="text-xs text-on-surface-variant">
                Configure 5-day standard (Mon–Fri), 6-day commercial (Mon–Sat), or 4-day compressed schedules.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <h3 className="text-sm font-bold text-on-surface mb-1">Holiday Exclusions</h3>
              <p className="text-xs text-on-surface-variant">
                Toggle holiday exclusions. Does not silently assume US federal holidays for global users.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <h3 className="text-sm font-bold text-on-surface mb-1">Date-by-Date Iteration</h3>
              <p className="text-xs text-on-surface-variant">
                Iterates actual calendar dates rather than rough 5/7 multiplications for contract accuracy.
              </p>
            </div>
          </div>

          {renderToolGrid(businessDaysTools)}
        </div>
      </section>

      {/* SECTION 14 & 15: TIME ZONES & GLOBAL MEETINGS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Time Zones &amp; Global Meeting Tools
          </h2>
        </div>
        <p className="text-sm sm:text-base text-on-surface-variant mb-6 max-w-3xl">
          Compare local times, UTC offsets, daylight saving changes, and discover the best overlapping working hours
          under your selected schedule across distributed teams.
        </p>
        {renderToolGrid(timezoneTools)}
      </section>

      {/* SECTION 21: PLAN ACROSS THE WORLD (PAIR EXAMPLES) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-xs">
          <h3 className="text-lg font-bold text-on-surface mb-2">
            Plan Across the World: Key Meeting Corridors
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant mb-6 max-w-2xl">
            Quick reference for high-frequency transatlantic and transpacific business coordination:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/time-date/time-zone-overlap"
              className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-primary/40 border border-outline-variant/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-primary mb-1">Transatlantic</div>
                <div className="text-sm font-bold text-on-surface">New York ↔ London</div>
                <p className="text-xs text-on-surface-variant mt-1">
                  5-hour gap. Ideal window: 9:00 AM – 12:00 PM EST (2:00 PM – 5:00 PM BST).
                </p>
              </div>
              <span className="text-xs font-semibold text-primary mt-3 inline-flex items-center">
                Compare Overlap <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>

            <Link
              href="/time-date/time-zone-overlap"
              className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-primary/40 border border-outline-variant/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-primary mb-1">EMEA / Gulf</div>
                <div className="text-sm font-bold text-on-surface">London ↔ Dubai</div>
                <p className="text-xs text-on-surface-variant mt-1">
                  3 to 4-hour gap. Ideal window: 9:00 AM – 1:00 PM UK (1:00 PM – 5:00 PM GST).
                </p>
              </div>
              <span className="text-xs font-semibold text-primary mt-3 inline-flex items-center">
                Compare Overlap <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>

            <Link
              href="/time-date/time-zone-overlap"
              className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-primary/40 border border-outline-variant/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-primary mb-1">South / SE Asia</div>
                <div className="text-sm font-bold text-on-surface">India ↔ Singapore</div>
                <p className="text-xs text-on-surface-variant mt-1">
                  2.5-hour gap. Extensive overlap: 9:30 AM – 4:30 PM IST (12:00 PM – 7:00 PM SGT).
                </p>
              </div>
              <span className="text-xs font-semibold text-primary mt-3 inline-flex items-center">
                Compare Overlap <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>

            <Link
              href="/time-date/time-zone-overlap"
              className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container hover:border-primary/40 border border-outline-variant/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-primary mb-1">Transpacific</div>
                <div className="text-sm font-bold text-on-surface">Los Angeles ↔ Tokyo</div>
                <p className="text-xs text-on-surface-variant mt-1">
                  16 to 17-hour difference. Optimal afternoon/morning handshake.
                </p>
              </div>
              <span className="text-xs font-semibold text-primary mt-3 inline-flex items-center">
                Compare Overlap <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 17 & 18: COUNTDOWNS & MILESTONES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Hourglass className="w-5 h-5 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Countdowns &amp; Milestones
          </h2>
        </div>
        <p className="text-sm sm:text-base text-on-surface-variant mb-6 max-w-3xl">
          Track upcoming calendar dates, planned retirements, vacations, and birthday milestones.
          Date-only countdowns by default, with live time tickers where exact moment tracking is desired.
        </p>
        {renderToolGrid(countdownTools)}
      </section>

      {/* SECTION 20: ADVANCED CALENDAR & DEVELOPER TOOLS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-5 h-5 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Advanced Calendar &amp; Date Tools
          </h2>
        </div>
        <p className="text-sm sm:text-base text-on-surface-variant mb-6 max-w-3xl">
          Deep calendar utilities for astronomical day numbering (Julian Day &amp; MJD), Unix epoch conversions,
          Gregorian leap year validation, and 24-hour military notation.
        </p>
        {renderToolGrid(advancedTools)}
      </section>
    </div>
  );
}
