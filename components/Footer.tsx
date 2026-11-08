import React from 'react';
import Link from 'next/link';
import {
  Calculator,
  ShieldCheck,
  Lock,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';

const FOOTER_CATEGORY_LINKS = [
  { label: 'Math Calculators', href: '/math' },
  { label: 'Finance & Tax', href: '/finance' },
  { label: 'Business & Margin', href: '/finance/business' },
  { label: 'Unit Conversions', href: '/conversions' },
  { label: 'Home & Construction', href: '/home-construction' },
  { label: 'Health & Fitness', href: '/health-fitness' },
  { label: 'Date & Time', href: '/date-time' },
  { label: 'Science & Lab', href: '/science' },
];

const FOOTER_POPULAR_TOOLS = [
  { label: 'Percentage Calculator', href: '/math/percentage-calculator' },
  { label: 'Global Salary & Take-Home Pay', href: '/salary-calculator' },
  { label: 'US Federal Income Tax', href: '/finance/us-federal-income-tax-calculator' },
  { label: 'Mortgage Payment Calculator', href: '/mortgage-calculator' },
  { label: 'FIRE Retirement Forecaster', href: '/fire-forecaster' },
  { label: 'Concrete & Cubic Yards', href: '/construction-project-calculator' },
  { label: 'Flooring & Box Estimator', href: '/flooring-calculator' },
  { label: 'Recipe & Baking Converter', href: '/recipe-converter' },
];

const FOOTER_RESOURCE_LINKS = [
  { label: 'All Calculators Directory (A–Z)', href: '/calculators' },
  { label: 'Multi-Step Calculation Workspace', href: '/calculation-workspace' },
  { label: 'Formula Guides & Tutorials', href: '/guides' },
  { label: 'Calculation Methodology', href: '/calculation-methodology' },
  { label: 'About SolveItCalculator', href: '/about' },
  { label: 'Contact & Report an Issue', href: '/contact' },
  { label: 'Accessibility Statement', href: '/accessibility' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="bg-white border-t border-[#E2E8F0] text-[#152238] mt-auto"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        {/* Main Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-9 border-b border-[#E2E8F0]">
          {/* Column 1: Brand Identity, Mission & Verification Standards (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#2457D6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                <Calculator className="w-5 h-5" aria-hidden="true" />
              </span>
              <div>
                <Link
                  href="/"
                  data-no-translate="true"
                  className="text-xl font-extrabold tracking-tight text-[#152238] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                >
                  SolveIt<span className="text-[#2457D6]">Calculator</span>
                </Link>
                <p className="text-xs font-medium text-[#64748B]">
                  Verified Formulas &amp; Decision Tools
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed max-w-sm">
              Free, fast online calculators built with transparent step-by-step formulas,
              practitioner field notes, and authoritative reference tables across math, personal
              finance, construction, conversions, health, and science.
            </p>

            {/* Clean Trust & Standards Highlights */}
            <ul className="space-y-2 pt-1 text-xs text-[#475569]">
              <li className="flex items-center gap-2">
                <ShieldCheck
                  className="w-4 h-4 text-[#16856B] shrink-0"
                  aria-hidden="true"
                />
                <span>Benchmarked against NIST SP 811 &amp; statutory tax tables</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock
                  className="w-4 h-4 text-[#2457D6] shrink-0"
                  aria-hidden="true"
                />
                <span>100% browser-private — inputs never leave your device</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen
                  className="w-4 h-4 text-[#D97706] shrink-0"
                  aria-hidden="true"
                />
                <span>Every result includes the underlying formula &amp; worked steps</span>
              </li>
            </ul>

            {/* Direct Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <Link
                href="/calculators"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2457D6] hover:bg-[#1D47B0] text-white text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <span>Browse All Calculators</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/calculation-workspace"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#152238] hover:text-[#2457D6] border border-[#E2E8F0] text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <span>Calculation Workspace</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Calculator Categories (2 cols) */}
          <nav
            aria-label="Calculator categories"
            className="lg:col-span-2 space-y-3"
          >
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#152238]">
              Categories
            </h2>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-[#475569]">
              {FOOTER_CATEGORY_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-[#2457D6] transition-colors inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Popular Calculators (3 cols) */}
          <nav
            aria-label="Popular calculators"
            className="lg:col-span-3 space-y-3"
          >
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#152238]">
              Popular Calculators
            </h2>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-[#475569]">
              {FOOTER_POPULAR_TOOLS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-[#2457D6] transition-colors inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Resources, Standards & Company (3 cols) */}
          <nav
            aria-label="Resources and legal information"
            className="lg:col-span-3 space-y-3"
          >
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#152238]">
              Resources &amp; Standards
            </h2>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium text-[#475569]">
              {FOOTER_RESOURCE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-[#2457D6] transition-colors inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar: Copyright, Disclaimer & Legal Quick Links */}
        <div className="pt-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="space-y-1">
            <p className="text-[#475569]">
              © {new Date().getFullYear()}{' '}
              <strong className="font-bold text-[#152238]">
                SolveItCalculator.com
              </strong>
              . All rights reserved.
            </p>
            <p className="text-[11.5px] text-[#64748B] max-w-2xl leading-relaxed">
              Calculators and reference guides are provided for informational and educational
              purposes only and do not constitute formal financial, tax, medical, or engineering
              advice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-semibold text-[#475569]">
            <Link
              href="/calculation-methodology"
              className="hover:text-[#2457D6] transition-colors"
            >
              Methodology
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-[#2457D6] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-[#2457D6] transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/accessibility"
              className="hover:text-[#2457D6] transition-colors"
            >
              Accessibility
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#2457D6] transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
