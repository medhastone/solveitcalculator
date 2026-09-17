"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCurrentTheme, toggleTheme } from "../lib/theme";

export default function Footer() {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDark(getCurrentTheme() === "dark");
    }, 0);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setIsDark(customEvent.detail === "dark");
      } else {
        setIsDark(getCurrentTheme() === "dark");
      }
    };

    window.addEventListener("solveit-theme-change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("solveit-theme-change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setIsDark(next === "dark");
  };

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 mt-space-3xl transition-colors duration-150">
      <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop pt-space-2xl pb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl pb-space-2xl border-b border-outline-variant/30">
          <div className="lg:col-span-4 pr-8">
            <div className="mb-5">
              <Link
                href="/"
                className="inline-flex items-center focus:outline-none group select-none py-1 relative h-14 sm:h-16 md:h-20 aspect-[238/54]"
                aria-label="SolveIt Calculator Homepage"
              >
                <Image
                  src="/logo.png?v=2"
                  alt="SolveIt Calculator Brand Logo"
                  className="object-contain block transition-transform duration-150 group-hover:scale-[1.02]"
                  fill
                  sizes="(max-width: 640px) 150px, 200px"
                />
              </Link>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mb-6 leading-relaxed">
              &quot;Every Calculation. One Place.&quot; The world's most
              comprehensive directory of high-precision mathematical, financial,
              and scientific tools. Powered by client-side execution for
              absolute privacy.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggle}
                aria-label={
                  isDark ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-all shadow-sm border border-outline-variant/30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isDark ? "light_mode" : "dark_mode"}
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            <div>
              <h4 className="font-headline-sm text-body-lg text-on-surface font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  payments
                </span>{" "}
                Finance
              </h4>
              <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
                <li>
                  <Link
                    href="/finance"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block group-hover:bg-primary"></span>{" "}
                    Finance Hub
                  </Link>
                </li>
                <li>
                  <Link
                    href="/finance/mortgage-calculator"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Mortgages
                  </Link>
                </li>
                <li>
                  <Link
                    href="/investing-and-growth"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Investing (SIP/CAGR)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/finance/emi-calculator"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    EMI & Loans
                  </Link>
                </li>
                <li>
                  <Link
                    href="/retirement-and-super"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Retirement (401k)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/global-tax-calculator"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Tax Brackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/credit-cards-and-revolving"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Credit Cards
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-headline-sm text-body-lg text-on-surface font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  vital_signs
                </span>{" "}
                Health
              </h4>
              <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
                <li>
                  <Link
                    href="/health"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Health Hub
                  </Link>
                </li>
                <li>
                  <Link
                    href="/health/bmi"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    BMI Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/health#bmr-card"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    BMR Estimator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/health#tdee-card"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    TDEE & Macros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/health#navy-card"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Body Fat %
                  </Link>
                </li>
              </ul>

              <h4 className="font-headline-sm text-body-lg text-on-surface font-bold mt-8 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[18px]">
                  domain
                </span>{" "}
                Business
              </h4>
              <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
                <li>
                  <Link
                    href="/business"
                    className="hover:text-tertiary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Business Hub
                  </Link>
                </li>
                <li>
                  <Link
                    href="/business#category-profit"
                    className="hover:text-tertiary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Margin & Markup
                  </Link>
                </li>
                <li>
                  <Link
                    href="/business#category-startup"
                    className="hover:text-tertiary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Cash Runway
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-headline-sm text-body-lg text-on-surface font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  functions
                </span>{" "}
                Math & Science
              </h4>
              <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
                <li>
                  <Link
                    href="/math"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Math Hub
                  </Link>
                </li>
                <li>
                  <Link
                    href="/percentage-calculator"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Percentages
                  </Link>
                </li>
                <li>
                  <Link
                    href="/math#quick-solve"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Scientific Solver
                  </Link>
                </li>
                <li>
                  <Link
                    href="/math#quick-solve"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Fractions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/science"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Science Hub
                  </Link>
                </li>
                <li>
                  <Link
                    href="/science#workbenches"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Molarity
                  </Link>
                </li>
                <li>
                  <Link
                    href="/education"
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Education (GPA)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-headline-sm text-body-lg text-on-surface font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  build
                </span>{" "}
                Utilities
              </h4>
              <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface-variant">
                <li>
                  <Link
                    href="/time-date"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Date & Time Hub
                  </Link>
                </li>
                <li>
                  <Link
                    href="/time-date/age-calculator"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Exact Age
                  </Link>
                </li>
                <li>
                  <Link
                    href="/conversions"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Metric Conversions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/electrical"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Electrical Engineering
                  </Link>
                </li>
                <li>
                  <Link
                    href="/home-construction"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Home Construction
                  </Link>
                </li>
                <li>
                  <Link
                    href="/technology"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Tech & Dev
                  </Link>
                </li>
                <li>
                  <Link
                    href="/automotive-calculators-estimators"
                    className="hover:text-secondary transition-colors flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-outline-variant inline-block"></span>{" "}
                    Automotive
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 font-body-sm text-body-sm text-on-surface-variant">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p>
              © {new Date().getFullYear()} SolveItCalculator.com. All rights
              reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-use"
              className="hover:text-primary transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              href="/about-us"
              className="hover:text-primary transition-colors"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
