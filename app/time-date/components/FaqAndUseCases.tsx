'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Briefcase,
  Plane,
  HeartHandshake,
  Clock,
  Globe,
  Sparkles,
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const USE_CASES = [
  {
    title: 'Planning a Project',
    icon: Briefcase,
    desc: 'Calculate exact delivery dates and working days while accounting for sprints, weekends, and holidays.',
    link: '/time-date/plan-a-project-calculator',
  },
  {
    title: 'Planning a Vacation',
    icon: Plane,
    desc: 'Count down remaining workdays until your trip, calculate PTO days, and determine total travel duration.',
    link: '/time-date/days-between-dates',
  },
  {
    title: 'Planning Retirement',
    icon: HeartHandshake,
    desc: 'Estimate remaining calendar days, working shifts, and accumulated working hours until your planned retirement date.',
    link: '/time-date/retirement-countdown-in-workdays',
  },
  {
    title: 'Managing Work Hours',
    icon: Clock,
    desc: 'Calculate shifts, deduct lunch breaks, total billable hours, and compute 1.5x/2.0x overtime for timesheets.',
    link: '/time-date/work-hours',
  },
  {
    title: 'Planning Global Meetings',
    icon: Globe,
    desc: 'Find workable overlapping business hours across distributed time zones to eliminate scheduling friction.',
    link: '/time-date/time-zone-overlap',
  },
  {
    title: 'Tracking Milestones',
    icon: Sparkles,
    desc: 'Celebrate birthdays, half-birthdays, wedding anniversaries, exam countdowns, and landmark date milestones.',
    link: '/time-date/birthday-tracker',
  },
];

const RECENTLY_UPDATED = [
  {
    name: 'Time Zone Converter',
    date: 'September 2026',
    href: '/time-date/time-zone-converter',
    note: 'Updated IANA daylight saving time transitions and city offset tables.',
  },
  {
    name: 'Business Days Calculator',
    date: 'September 2026',
    href: '/business-days-calculator',
    note: 'Enhanced custom workweek selection (4-day, 5-day, 6-day) and regional holiday toggles.',
  },
  {
    name: 'Retirement Countdown',
    date: 'August 2026',
    href: '/time-date/retirement-countdown-in-workdays',
    note: 'Refined workday and shift calculation breakdowns for retirement planning.',
  },
  {
    name: 'Leap Year Calculator',
    date: 'August 2026',
    href: '/time-date/leap-year-calculator',
    note: 'Verified 400-year Gregorian cycle rules and multi-century calendar queries.',
  },
  {
    name: 'Unix Timestamp Converter',
    date: 'July 2026',
    href: '/time-date/unix-timestamp-converter',
    note: 'Added milliseconds and ISO 8601 standardized UTC conversion formatters.',
  },
];

const FAQS = [
  {
    q: 'What time and date calculators are available on SolveItCalculator?',
    a: 'We offer a complete suite of calendar-aware tools including chronological age calculation, date differences, adding and subtracting dates, business days, shift and payroll hours, global time zones, event countdowns, leap year verification, and advanced formats like Unix timestamps and Julian days.',
  },
  {
    q: 'How do I calculate my exact age?',
    a: 'Our Age Calculator uses calendar-aware arithmetic rather than approximating 365 days per year. It counts full completed calendar years, remaining months, and remaining days between your date of birth and the target date, while accounting for leap years.',
  },
  {
    q: 'What is the difference between inclusive and exclusive date counting?',
    a: 'In exclusive counting (standard calendar difference), the start date is omitted (e.g., from Monday to Tuesday is 1 day). In inclusive counting, both the start date and end date are included (e.g., Monday through Tuesday is 2 days). You can toggle between both methods on our date calculators.',
  },
  {
    q: 'How do business-day calculators work?',
    a: 'Business day tools iterate day-by-day across your chosen date range to evaluate each calendar date against your configured workweek (such as Monday–Friday or Monday–Saturday) and exclude designated public or bank holidays.',
  },
  {
    q: 'Can I exclude holidays from date calculations?',
    a: 'Yes. Our Business Days tools allow you to toggle holiday exclusions, define custom non-working dates, and select regional calendars rather than forcing a single jurisdiction on global users.',
  },
  {
    q: 'How are months handled when adding or subtracting dates?',
    a: 'Because months vary from 28 to 31 days, adding a month is calendar-dependent. For example, adding 1 month to January 31 lands on February 28 (or February 29 in a leap year) using the standard end-of-month pinning convention.',
  },
  {
    q: 'Do leap years affect date calculations?',
    a: 'Yes. Under the Gregorian calendar, years divisible by 4 are leap years (366 days), except century years unless divisible by 400. For instance, 2000 and 2024 are leap years, but 1900 and 2100 are common years (365 days). All our date engines honor these rules.',
  },
  {
    q: 'How do time zones affect date and time calculations?',
    a: 'Time zones determine local clock times relative to Coordinated Universal Time (UTC). Crossing the International Date Line or timezone boundaries can advance or retard the local calendar date, which our time zone converters account for automatically.',
  },
  {
    q: 'What happens during daylight-saving changes?',
    a: 'When regions transition to Daylight Saving Time (spring forward) or standard time (fall back), local clock offsets shift by one hour. Because different countries switch on different calendar dates, meeting overlaps change temporarily.',
  },
  {
    q: 'What is a Unix timestamp?',
    a: 'A Unix timestamp is the total number of non-leap seconds elapsed since 00:00:00 UTC on January 1, 1970 (the Unix epoch). It provides a standardized, timezone-independent numeric representation of a moment in time.',
  },
  {
    q: 'What is ISO 8601?',
    a: 'ISO 8601 is an international standard for formatting dates and times, represented as YYYY-MM-DD (e.g., 2026-09-24) or YYYY-MM-DDTHH:MM:SSZ for UTC timestamps, eliminating ambiguity between month-first and day-first notations.',
  },
  {
    q: 'Can I calculate time between two times?',
    a: 'Yes. Our Time Calculator and Work Hours Calculator determine the exact elapsed hours, minutes, and seconds between two clock times, including cross-midnight shifts and optional lunch break deductions.',
  },
  {
    q: 'Can I count workdays using a custom schedule?',
    a: 'Yes. You can customize the working week (such as 4-day workweeks, 6-day retail shifts, or standard 5-day schedules) to calculate accurate deadline and project spans.',
  },
  {
    q: 'Why does my result differ from another date calculator?',
    a: 'Different tools may use different counting conventions (inclusive vs. exclusive), month-end rollover rules, regional holiday lists, or time-zone shifts. SolveItCalculator clearly displays all counting assumptions alongside your result.',
  },
];

export default function FaqAndUseCases() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-16 py-12">
      {/* SECTION 47: EVERYDAY USE CASES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Real-World Application
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            Time &amp; Date Tools for Everyday Life
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            From daily work shifts to once-in-a-lifetime celebrations, here is how our tools solve real scheduling challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon;
            return (
              <Link
                key={uc.title}
                href={uc.link}
                className="group p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/50 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
                    {uc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                    {uc.desc}
                  </p>
                </div>
                <div className="text-xs font-semibold text-primary flex items-center group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <span className="ml-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 48: RECENTLY UPDATED CALCULATORS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-container-low p-6 sm:p-8 rounded-3xl border border-outline-variant/40">
          <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight mb-2">
            Recently Updated Time &amp; Date Calculators
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mb-6">
            Ongoing calendar and timezone maintenance ensuring high reliability:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECENTLY_UPDATED.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-on-surface group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                    <span className="text-on-surface-variant font-mono text-[11px]">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {item.note}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 45 & 46: FAQS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            Clear explanations on calendar counting rules, timezone transitions, and calculation assumptions.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-surface-container-low transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-on-surface">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-on-surface-variant shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10">
                    <p className="mt-2">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 29 & 51: DISCLAIMERS & PRIVACY */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-4 text-xs text-on-surface-variant leading-relaxed">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-on-surface font-semibold">Legal &amp; Statutory Deadlines Notice:</strong>{' '}
              Model a deadline using your selected counting convention, weekends, and holidays. For jurisdiction-specific
              legal deadlines, court filings, tax dates, or statutory limitation periods, verify the applicable statutory
              rules with the relevant authority or a qualified professional.
            </div>
          </div>
          <div className="flex items-start gap-3 pt-3 border-t border-outline-variant/20">
            <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-on-surface font-semibold">Privacy-Conscious Calculations:</strong>{' '}
              Where supported, calculator inputs are processed locally in your browser sandbox. No dates of birth,
              work schedules, or personal event notes are transmitted to remote servers.
            </div>
          </div>
          <div className="flex items-start gap-3 pt-3 border-t border-outline-variant/20">
            <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-on-surface font-semibold">Questions or Suggestions?</strong>{' '}
              Contact our engineering team at{' '}
              <a href="mailto:info@solveitcalculator.com" className="text-primary hover:underline">
                info@solveitcalculator.com
              </a>.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
