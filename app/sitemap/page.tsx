import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingUp,
  HeartPulse,
  Clock,
  Repeat,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Layers,
  FileText,
  Search,
} from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Site Directory & Visual Sitemap | SolveItCalculator',
  description:
    'Explore the complete directory of free online calculators and conversion tools for finance, health, dates, time, units, and math on SolveItCalculator.',
  alternates: {
    canonical: 'https://solveitcalculator.com/sitemap/',
  },
};

interface SitemapSection {
  title: string;
  icon: React.ElementType;
  description: string;
  color: string;
  bgColor: string;
  links: { name: string; href: string; badge?: string }[];
}

const SECTIONS: SitemapSection[] = [
  {
    title: 'Finance & Money',
    icon: TrendingUp,
    description: 'Calculate mortgage installments, loan payments, investment growth, and taxes.',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    links: [
      { name: 'Finance Hub', href: '/finance', badge: 'Category' },
      { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'EMI Loan Payoff Calculator', href: '/loans-and-amortization' },
      { name: 'Compound Interest & SIP Growth', href: '/investing-and-growth' },
      { name: 'Salary & Payroll Breakdown', href: '/salary-and-payroll' },
      { name: 'Global Income Tax & GST Estimator', href: '/tax-engines-global' },
      { name: 'Freelance Hourly Rate Calculator', href: '/freelance-hourly-rate-calculator' },
      { name: 'Credit Card Payoff Calculator', href: '/credit-cards-and-revolving' },
    ],
  },
  {
    title: 'Health & Fitness',
    icon: HeartPulse,
    description: 'Track your body measurements, running pace, and daily energy cycles.',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/20',
    links: [
      { name: 'Health & Fitness Hub', href: '/health-fitness-calculators', badge: 'Category' },
      { name: 'BMI Calculator (Body Mass Index)', href: '/health-fitness-calculators/bmi' },
      { name: 'Running & Walking Pace Calculator', href: '/running-pace-calculator' },
      { name: '90-Minute Focus & Energy Cycles', href: '/time-date/90-minute-ultradian-rhythm-planner' },
      { name: 'Pet Age to Human Years Converter', href: '/pet-age-converter' },
    ],
  },
  {
    title: 'Time & Dates',
    icon: Clock,
    description: 'Count exact days, find chronological age, calculate work hours, and world clocks.',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10 border-sky-500/20',
    links: [
      { name: 'Time & Date Hub', href: '/time-date', badge: 'Category' },
      { name: 'Exact Age Calculator', href: '/time-date/age-calculator' },
      { name: 'Days Between Dates', href: '/time-date/date-difference' },
      { name: 'Working Days Calculator', href: '/time-date/days-calculator' },
      { name: 'Work Hours & Overtime Calculator', href: '/time-date/work-hours' },
      { name: 'World Time Zone Overlap Finder', href: '/time-date/time-zone-overlap' },
      { name: 'Birthday Tracker & Countdown', href: '/time-date/birthday-tracker' },
      { name: 'Event Countdown Timer', href: '/time-date/event-countdown' },
      { name: 'Leap Year Checker', href: '/leap-year-calculator' },
    ],
  },
  {
    title: 'Universal Conversions',
    icon: Repeat,
    description: 'Convert between metric and imperial measurements for length, weight, and volume.',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    links: [
      { name: 'Conversion Hub', href: '/conversions', badge: 'Category' },
      { name: 'Length & Distance (Feet, Meters, Miles)', href: '/conversions' },
      { name: 'Weight & Mass (Pounds, Kilograms, Ounces)', href: '/conversions' },
      { name: 'Temperature (Celsius, Fahrenheit, Kelvin)', href: '/conversions' },
      { name: 'Area & Land Measurements', href: '/area-converter' },
      { name: 'Speed & Velocity (MPH, KM/H)', href: '/speed-converter' },
      { name: 'Volume & Kitchen Cooking Units', href: '/cooking-converter' },
      { name: 'Computer Data Storage (GB, TB, MB)', href: '/data-storage-converter' },
    ],
  },
  {
    title: 'Science & Math',
    icon: Wrench,
    description: 'Solve scientific formulas, calculate percentages, and electrical measurements.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    links: [
      { name: 'Science Hub', href: '/science', badge: 'Category' },
      { name: 'Scientific Calculator Workbench', href: '/scientific-calculator' },
      { name: 'Percentage Calculator Suite', href: '/percentage-calculator' },
      { name: 'Electrical Sizing & Power Tools', href: '/electrical' },
      { name: 'Automotive Gear Ratio Calculator', href: '/gear-ratio-calculator' },
      { name: 'Day & Night World Sunlight Map', href: '/time-date/day-night-world-map' },
      { name: 'Moon Phase & Lunar Calendar', href: '/time-date/moon-phase-calculator' },
    ],
  },
  {
    title: 'Information & Legal',
    icon: ShieldCheck,
    description: 'Learn about our mission, privacy practices, and terms of service.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    links: [
      { name: 'About SolveItCalculator', href: '/about-us' },
      { name: 'Privacy Policy (100% In-Browser)', href: '/privacy' },
      { name: 'Terms of Use', href: '/terms-of-use' },
      { name: 'XML Search Engine Sitemap', href: '/sitemap.xml' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      {/* 1st Tier: Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Site Directory & Sitemap' },
        ]}
        badge="Complete Tool Directory"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container text-xs font-semibold text-primary uppercase tracking-wider border border-outline-variant/40">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Complete Website Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface font-headline-lg">
            Site Directory &amp; Sitemap
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Easily browse all free online calculators, conversion tools, and information pages available on SolveItCalculator. Find what you need in seconds.
          </p>
        </section>

        {/* Directory Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-colors space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${section.bgColor} border`}>
                      <Icon className={`w-5 h-5 ${section.color}`} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-on-surface">{section.title}</h2>
                      <span className="text-[11px] text-on-surface-variant font-medium">
                        {section.links.length} tools &amp; guides
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {section.description}
                  </p>

                  <ul className="pt-2 border-t border-outline-variant/30 space-y-2">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="flex items-center justify-between text-xs text-on-surface hover:text-primary transition-colors py-1 group"
                        >
                          <span className="group-hover:translate-x-1 transition-transform">
                            {link.name}
                          </span>
                          {link.badge ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-primary border border-outline-variant/40">
                              {link.badge}
                            </span>
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </section>

        {/* Privacy & Fast Trust Box */}
        <section className="bg-surface-container/60 rounded-2xl border border-outline-variant/40 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Safe, Private &amp; In-Browser</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface">Your Numbers Stay on Your Device</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Every calculator on SolveItCalculator runs directly in your web browser. No birthdays, loan details, salaries, or health numbers are ever sent to our servers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/privacy"
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant/40 transition-colors"
            >
              Read Privacy Policy
            </Link>
            <Link
              href="/about-us"
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              About Our Team
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
