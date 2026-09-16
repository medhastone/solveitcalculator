"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AboutClient() {
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const faqs = [
    {
      q: "What is SolveItCalculator?",
      a: "SolveItCalculator (https://solveitcalculator.com) is an open, high-precision digital computational repository. We engineer web-based calculation engines covering mortgage amortization, investment compounding, progressive taxation, unit conversions, and algebraic formulas designed to deliver instant mathematical answers without friction or corporate paywalls."
    },
    {
      q: "Are the calculators really 100% free to use?",
      a: "Yes, categorically. There are no premium account tiers, trial periods, subscription fees, or feature gates. We believe standard mathematical calculations are essential utilities that should remain accessible to students, educators, professionals, and households everywhere. The platform is ethically sustained via non-intrusive Google AdSense advertising."
    },
    {
      q: "How accurate are the calculation results?",
      a: "All algorithms are implemented based on statutory legislation (such as Federal Reserve Regulation Z for lending), IRS publication formulas, and NIST metric standards. We implement integer-scale arithmetic to prevent standard IEEE 754 floating-point drift. Output schedules are cross-benchmarked against established institutional tables to guarantee mathematical fidelity."
    },
    {
      q: "Do I need to create an account or provide personal details?",
      a: "No. SolveItCalculator does not require registration, usernames, passwords, phone numbers, or email captures to access any tool. You can open any workbench and compute immediately without introducing identity verification friction."
    },
    {
      q: "Is my financial or personal data stored on your servers?",
      a: "Never. Our calculators run exclusively on the client side inside your web browser’s JavaScript sandbox. The numbers you enter into loan amounts, interest rates, or salary forms are never transmitted to our web servers, saved to disk, or shared with third-party trackers."
    },
    {
      q: "Can calculator results be used for legal or certified tax filings?",
      a: (
        <>
          SolveItCalculator provides computational models for educational, informational, and illustrative purposes. Real tax and financial filings require formal verification with licensed CPAs, certified financial planners (CFP&reg;), or attorneys, as individualized deductions, local tax municipal codes, and underwriting variances may apply.
        </>
      )
    },
    {
      q: "How frequently are formulas and tax rates updated?",
      a: "Our editorial desk conducts an annual audit of all progressive tax schedules, standard deduction ceilings, and inflation brackets during the first quarter of each calendar year. In addition, conversion constants and unit coefficients are maintained under continuous metrological oversight."
    },
    {
      q: "How can I reach the SolveItCalculator team?",
      a: (
        <>
          You can reach our editorial and engineering team directly via email at <a className="text-primary font-semibold hover:underline" href="mailto:info@solveitcalculator.com">info@solveitcalculator.com</a>. We review calculation discrepancies, feedback, and enhancement proposals with an SLA response window of 24–48 business hours.
        </>
      )
    }
  ];

  return (
    <main className="w-full pt-16 bg-surface min-h-[calc(100vh-16rem)]">
      <div className="flex flex-col w-full">
        
        {/* Top Metrology Precision Bar & Breadcrumbs */}
        <div className="w-full bg-surface-container-low/70 backdrop-blur-md">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
            <nav aria-label="Breadcrumbs" className="flex items-center gap-space-2xs text-on-surface-variant">
              <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </Link>
              <span className="text-outline-variant select-none">/</span>
              <span className="text-on-surface-variant/80">Company &amp; Information</span>
              <span className="text-outline-variant select-none">/</span>
              <span className="text-on-surface font-semibold">About Us</span>
            </nav>
            <div className="flex items-center gap-space-sm font-data-mono text-data-mono text-[11px] text-on-surface-variant">
              <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full text-secondary font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Engine v2.4.0
              </span>
              <span className="hidden md:inline text-outline-variant">•</span>
              <span className="hidden md:inline">Continuous Metrological Audit</span>
              <span className="hidden sm:inline text-outline-variant">•</span>
              <span className="text-primary font-medium">Status: Active Operational</span>
            </div>
          </div>
        </div>

        {/* Hero Header Section */}
        

        {/* Editorial Visual Section: Human Metrology Workbench */}
        <section className="w-full py-space-xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="relative overflow-hidden rounded-2xl bg-surface-container-high p-space-lg md:p-space-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                <div className="lg:col-span-7 space-y-space-md">
                  <div className="inline-flex items-center gap-1 bg-surface-container-lowest px-3 py-1 rounded-full text-primary font-label-caps text-label-caps uppercase">
                    Foundational Ethos
                  </div>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                    Why SolveItCalculator Was Built: Dismantling the Paywalled Web
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    In an internet crowded with algorithmic calculators hidden behind aggressive lead-generation forms, required corporate phone numbers, paid subscription tiers, and convoluted math, SolveItCalculator was engineered as an antidote.
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    We believe computational clarity is a fundamental utility—not a luxury or a bait-and-switch sales funnel. Whether you are a first-time home buyer deciphering a complex amortization schedule, a small business operator reconciling sales tax across multi-tier jurisdictions, or a student verifying thermodynamics, you deserve immediate, unbiased, and mathematically uncompromising answers without relinquishing personal privacy.
                  </p>
                  <div className="flex flex-wrap gap-space-sm pt-space-xs">
                    <div className="flex items-center gap-2 bg-surface-container-lowest px-3.5 py-2 rounded-lg font-data-mono text-data-mono text-xs text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[18px]">block</span>
                      No Lead Forms
                    </div>
                    <div className="flex items-center gap-2 bg-surface-container-lowest px-3.5 py-2 rounded-lg font-data-mono text-data-mono text-xs text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[18px]">speed</span>
                      Sub-Millisecond Engine
                    </div>
                    <div className="flex items-center gap-2 bg-surface-container-lowest px-3.5 py-2 rounded-lg font-data-mono text-data-mono text-xs text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[18px]">no_encryption_gmailerrorred</span>
                      Open Formula Provenance
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 relative">
                  <div className="relative w-full rounded-xl overflow-hidden shadow-xl aspect-[4/3] bg-surface-container-lowest flex items-center justify-center">
                    <svg viewBox="0 0 800 600" className="w-full h-full text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="800" height="600" className="fill-surface-container-low" />
                      <defs>
                        <pattern id="math-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                          <path d="M 60 0 L 0 0 0 60" fill="none" className="stroke-outline-variant/30" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="800" height="600" fill="url(#math-grid)" />
                      
                      {/* Central Calculator/Dashboard Pane */}
                      <rect x="150" y="100" width="500" height="400" rx="24" className="fill-surface stroke-outline-variant/50 shadow-sm" strokeWidth="2" />
                      
                      {/* Inner Elements */}
                      <rect x="200" y="150" width="400" height="120" rx="16" className="fill-surface-container-high" />
                      <path d="M 240 210 Q 300 170 350 210 T 460 210 T 560 210" className="stroke-primary" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <circle cx="240" cy="210" r="8" className="fill-primary" />
                      <circle cx="350" cy="210" r="8" className="fill-primary" />
                      <circle cx="460" cy="210" r="8" className="fill-primary" />
                      <circle cx="560" cy="210" r="8" className="fill-primary" />

                      {/* Bottom Grid/Buttons */}
                      <rect x="200" y="300" width="180" height="150" rx="16" className="fill-surface-container-high" />
                      <rect x="420" y="300" width="180" height="150" rx="16" className="fill-primary/10 stroke-primary/20" strokeWidth="2" />
                      
                      {/* Math Symbols in the grid */}
                      <path d="M260 375 L320 375 M290 345 L290 405" className="stroke-on-surface-variant" strokeWidth="8" strokeLinecap="round" />
                      <path d="M480 365 L540 365 M480 385 L540 385" className="stroke-primary" strokeWidth="8" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Computational Ecosystem */}
        <section className="w-full py-space-2xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
              <div className="space-y-space-2xs max-w-2xl">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">Our Computational Ecosystem</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                  Engineered Across 6 Specialized Mathematical Disciplines
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  From wealth projection equations to atomic unit scales, SolveItCalculator organizes specialized engines built to professional precision standards.
                </p>
              </div>
              <Link className="inline-flex items-center gap-2 bg-primary px-space-md py-2.5 rounded-lg text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary/90 transition-colors self-start md:self-auto shadow-sm" href="/">
                <span>Explore All Calculators</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {/* 1. Finance & Wealth Planning */}
              <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[26px]">savings</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">Fin-Tech</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                      Financial &amp; Wealth Planning
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                      Compound interest engines, FIRE (Financial Independence, Retire Early) forecasters, Roth IRA conversion models, inflation adjusters, and long-term capital accumulators.
                    </p>
                  </div>
                  <ul className="space-y-1 text-on-surface-variant font-data-mono text-data-mono text-xs">
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[14px]">arrow_right</span>Daily, Monthly &amp; Annual Compounding</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[14px]">arrow_right</span>Real Purchasing Power Projection</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[14px]">arrow_right</span>Retirement Safe Withdrawal Rates</li>
                  </ul>
                </div>
                <div className="mt-space-md pt-space-sm">
                  <Link className="inline-flex items-center gap-1 text-primary font-body-sm text-body-sm font-semibold hover:underline" href="/finance">
                    <span>View Financial Models</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </Link>
                </div>
              </article>

              {/* 2. Loans, Mortgages & Debt */}
              <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[26px]">real_estate_agent</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">Credit &amp; Debt</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-secondary transition-colors">
                      Loans, Mortgages &amp; Credit
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                      Complete principal-interest amortization schedules, extra payment acceleration tests, 0% balance transfer paydown timelines, and APR vs. APY reconciliation.
                    </p>
                  </div>
                  <ul className="space-y-1 text-on-surface-variant font-data-mono text-data-mono text-xs">
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[14px]">arrow_right</span>Bi-Weekly vs. Monthly Payoff Impact</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[14px]">arrow_right</span>PMI Drop-off &amp; Escrow Estimators</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[14px]">arrow_right</span>Credit Card Snowball vs. Avalanche</li>
                  </ul>
                </div>
                <div className="mt-space-md pt-space-sm">
                  <Link className="inline-flex items-center gap-1 text-secondary font-body-sm text-body-sm font-semibold hover:underline" href="/finance">
                    <span>View Lending Calculators</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </Link>
                </div>
              </article>

              {/* 3. Global Tax & Compliance */}
              <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[26px]">receipt_long</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">Taxation</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-tertiary transition-colors">
                      Global Tax &amp; Compliance
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                      Jurisdictional sales tax and VAT reverse calculators, US Federal &amp; State progressive income tax estimates, FICA/Medicare deductions, and paycheck gross-to-net conversions.
                    </p>
                  </div>
                  <ul className="space-y-1 text-on-surface-variant font-data-mono text-data-mono text-xs">
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-tertiary text-[14px]">arrow_right</span>Statutory Marginal Bracket Logic</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-tertiary text-[14px]">arrow_right</span>GST / VAT Inclusive &amp; Exclusive Modes</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-tertiary text-[14px]">arrow_right</span>Standard vs. Itemized Comparison</li>
                  </ul>
                </div>
                <div className="mt-space-md pt-space-sm">
                  <Link className="inline-flex items-center gap-1 text-tertiary font-body-sm text-body-sm font-semibold hover:underline" href="/tax-calculator">
                    <span>View Tax Calculators</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </Link>
                </div>
              </article>

              {/* 4. Universal Conversion Center */}
              <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[26px]">swap_horiz</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">Metrology</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                      Universal Unit Conversion
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                      Multi-dimensional metric, imperial, astronomical, and culinary conversion tables calibrated against BIPM and NIST international reference baselines.
                    </p>
                  </div>
                  <ul className="space-y-1 text-on-surface-variant font-data-mono text-data-mono text-xs">
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-on-surface text-[14px]">arrow_right</span>Mass, Length, Volume &amp; Pressure</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-on-surface text-[14px]">arrow_right</span>Scientific Temperatures (C, F, K, R)</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-on-surface text-[14px]">arrow_right</span>Data Transfer Rates &amp; Storage Units</li>
                  </ul>
                </div>
                <div className="mt-space-md pt-space-sm">
                  <Link className="inline-flex items-center gap-1 text-primary font-body-sm text-body-sm font-semibold hover:underline" href="/conversions">
                    <span>View Conversion Center</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </Link>
                </div>
              </article>

              {/* 5. Math & Computational Workbench */}
              <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[26px]">functions</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">STEM</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
                      Everyday Math &amp; STEM
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                      Percentage increase/decrease analyzers, geometric volume solvers, quadratic equations, statistical variance, and standard deviation suites.
                    </p>
                  </div>
                  <ul className="space-y-1 text-on-surface-variant font-data-mono text-data-mono text-xs">
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[14px]">arrow_right</span>Instant Percentage Variance Multiplier</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[14px]">arrow_right</span>Fraction Reduction &amp; Decimal Conversion</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[14px]">arrow_right</span>Pythagorean &amp; Polygon Trigonometry</li>
                  </ul>
                </div>
                <div className="mt-space-md pt-space-sm">
                  <Link className="inline-flex items-center gap-1 text-primary font-body-sm text-body-sm font-semibold hover:underline" href="/math">
                    <span>View Math Workbenches</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </Link>
                </div>
              </article>

              {/* 6. Health, Work & Chronology */}
              <article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[26px]">schedule</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">Life &amp; Time</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-secondary transition-colors">
                      Health, Fitness &amp; Time
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                      BMI &amp; BMR body metrics, business days excluding regional bank holidays, precise age chronometers, and international remote-work overlap schedules.
                    </p>
                  </div>
                  <ul className="space-y-1 text-on-surface-variant font-data-mono text-data-mono text-xs">
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[14px]">arrow_right</span>Calendar Day &amp; Working Hour Counting</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[14px]">arrow_right</span>WHO Standardized Health Formulations</li>
                    <li className="flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[14px]">arrow_right</span>Timezone Matrix Optimization</li>
                  </ul>
                </div>
                <div className="mt-space-md pt-space-sm">
                  <Link className="inline-flex items-center gap-1 text-secondary font-body-sm text-body-sm font-semibold hover:underline" href="/health-fitness-calculators">
                    <span>View Time &amp; Health Tools</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Section 4 & 5: How Our Calculators Work & Commitment to Accuracy */}
        <section className="w-full py-space-2xl bg-surface-container-low">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="max-w-3xl mb-space-xl space-y-space-2xs">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">The Engineering Pipeline</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Commitment to Accuracy: The 4-Stage Verification Protocol
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Calculations are never simple copy-paste snippets. Every algorithm on SolveItCalculator undergoes an exhaustive engineering pipeline designed to eliminate rounding anomalies, floating-point drift, and formula ambiguity.
              </p>
            </div>

            {/* Process Pipeline Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md relative">
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between text-primary font-data-mono text-data-mono font-bold">
                    <span>STAGE 01</span>
                    <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Statutory Grounding</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Every tool begins with primary source documentation: US Title 12 Regulation Z (Truth in Lending), IRS Publication 15, ISO 80000 quantities, and peer-reviewed actuarial journals.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs text-on-surface-variant font-data-mono text-[11px]">Source Verification</div>
              </div>
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between text-secondary font-data-mono text-data-mono font-bold">
                    <span>STAGE 02</span>
                    <span className="material-symbols-outlined text-[20px]">terminal</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Algorithmic Modeling</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Formulas are implemented using deterministic, purely functional JavaScript paradigms, isolating input parameters from side-effects to maintain mathematical reproducibility.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs text-on-surface-variant font-data-mono text-[11px]">Pure Functional Logic</div>
              </div>
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between text-tertiary font-data-mono text-data-mono font-bold">
                    <span>STAGE 03</span>
                    <span className="material-symbols-outlined text-[20px]">memory</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">IEEE 754 Optimization</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    We apply integer-scale scaling (e.g. cents arithmetic) and epsilon rounding guards to defeat binary floating-point imprecision inherent in native microprocessors.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs text-on-surface-variant font-data-mono text-[11px]">Anti-Drift Shield</div>
              </div>
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between text-on-surface font-data-mono text-data-mono font-bold">
                    <span>STAGE 04</span>
                    <span className="material-symbols-outlined text-[20px]">fact_check</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Dual Cross-Audit</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Output datasets are benchmarked against official federal calculators (CFPB, IRS Interactive, NIST conversion matrices) across tens of thousands of automated unit tests.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs text-on-surface-variant font-data-mono text-[11px]">Automated Regression</div>
              </div>
            </div>

            {/* Technical Metrology Box */}
            <div className="mt-space-xl bg-surface-container-highest/60 p-space-lg rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">architecture</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-headline-md text-headline-md text-on-surface">Standard Dimensional Metrology</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Dimensional coefficients adhere strictly to the International System of Units (SI) Broadsheet and Federal Reserve Board Regulation Z compounding schedules.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-lowest px-space-md py-space-xs rounded-lg font-data-mono text-data-mono text-xs text-on-surface shrink-0 shadow-sm">
                Precision: ±1e-12 Machine Epsilon
              </div>
            </div>
          </div>
        </section>

        {/* Section 6, 7 & 8: Transparency, Educational Mission, and Privacy-First Sandbox */}
        <section className="w-full py-space-2xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl items-stretch">
              {/* Privacy Box */}
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="space-y-space-md">
                  <div className="inline-flex items-center gap-2 bg-secondary-fixed/50 px-3 py-1 rounded-full text-secondary font-label-caps text-label-caps uppercase">
                    <span className="material-symbols-outlined text-[16px]">fingerprint_off</span>
                    <span>Client-Side Privacy Sandbox</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                    Your Numbers Never Leave Your Computer
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    When computing your mortgage amortization, entering your gross salary for an income tax estimate, or auditing personal debt, your financial figures represent confidential personal data. On SolveItCalculator, this information is protected by foundational architecture.
                  </p>
                  <div className="space-y-space-sm bg-surface-container-low p-space-md rounded-xl text-on-surface-variant font-body-sm text-body-sm">
                    <div className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-secondary shrink-0 text-[20px]">check_circle</span>
                      <span><strong>Zero In-Transit Transmission:</strong> No API payloads containing your calculation variables are dispatched over the network.</span>
                    </div>
                    <div className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-secondary shrink-0 text-[20px]">check_circle</span>
                      <span><strong>No Database Persistence:</strong> We maintain zero databases of user entries. Closing your browser tab immediately flushes client RAM.</span>
                    </div>
                    <div className="flex items-start gap-space-xs">
                      <span className="material-symbols-outlined text-secondary shrink-0 text-[20px]">check_circle</span>
                      <span><strong>Stateless Processing:</strong> We do not employ user session cookies to stitch calculations to your personal identity.</span>
                    </div>
                  </div>
                </div>
                <div className="pt-space-md flex items-center gap-space-xs text-secondary font-data-mono text-data-mono text-xs">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Audited for Zero Telemetry Logging</span>
                </div>
              </div>
              
              {/* Educational Purpose Box */}
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="space-y-space-md">
                  <div className="inline-flex items-center gap-2 bg-primary-fixed/50 px-3 py-1 rounded-full text-primary font-label-caps text-label-caps uppercase">
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    <span>Educational &amp; Illustrative Purpose</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                    Equipping You to Speak Confidently with Professionals
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    SolveItCalculator is explicitly designed as a self-directed educational intelligence engine. While our algorithms are calibrated with mathematical exactness, real-world financial, tax, and legal scenarios are subject to nuanced statutory interpretations, discretionary lender fees, and regional variations.
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Our tools generate baseline computational insights to equip consumers with clear questions and structured figures before consulting Certified Public Accountants (CPAs), Certified Financial Planners (CFP&reg;), licensed mortgage brokers, or credentialed attorneys.
                  </p>
                  <div className="bg-surface-container-high/60 p-space-sm rounded-xl flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-primary text-[24px] shrink-0">info</span>
                    <span>Calculators produce mathematical simulations, not customized legal, investment, or statutory tax advice.</span>
                  </div>
                </div>
                <div className="pt-space-md flex items-center gap-space-xs text-primary font-data-mono text-data-mono text-xs">
                  <span className="material-symbols-outlined text-[16px]">balance</span>
                  <span>Ethical Financial Disclosures Upfront</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Editorial Image Showcase: Data Visualization & Precision */}
        <section className="w-full py-space-md">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="space-y-space-sm">
                  <div className="w-full h-52 rounded-xl overflow-hidden relative bg-surface-container flex items-center justify-center p-6">
                    <svg viewBox="0 0 300 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="20" y="10" width="260" height="130" rx="8" className="fill-surface stroke-outline-variant" strokeWidth="2" />
                      <line x1="20" y1="50" x2="280" y2="50" className="stroke-outline-variant/50" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="20" y1="90" x2="280" y2="90" className="stroke-outline-variant/50" strokeWidth="1" strokeDasharray="4 4" />
                      <path d="M40 130 C 120 130, 180 90, 260 30" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />
                      <path d="M40 130 C 120 130, 180 90, 260 30 L 260 130 Z" className="fill-primary/10" />
                      <circle cx="260" cy="30" r="5" className="fill-primary" />
                    </svg>
                  </div>
                  <div className="font-label-caps text-label-caps uppercase text-primary">Interactive Clarity</div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Visualizing Long-Term Exponential Growth</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    We translate abstract compound formulas into intuitive interactive curves. Seeing how a 1% management fee erodes portfolio yields over thirty years transforms complex mathematics into tangible decisions.
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between">
                <div className="space-y-space-sm">
                  <div className="w-full h-52 rounded-xl overflow-hidden relative bg-surface-container flex items-center justify-center p-6">
                    <svg viewBox="0 0 300 150" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="150" cy="75" r="55" className="stroke-secondary/30" strokeWidth="2" strokeDasharray="6 4" />
                      <circle cx="150" cy="75" r="40" className="stroke-secondary" strokeWidth="4" />
                      <circle cx="150" cy="75" r="8" className="fill-secondary" />
                      <line x1="150" y1="75" x2="185" y2="50" className="stroke-on-surface" strokeWidth="3" strokeLinecap="round" />
                      <line x1="150" y1="75" x2="115" y2="75" className="stroke-on-surface-variant" strokeWidth="2" strokeLinecap="round" />
                      <path d="M120 25 L180 25" className="stroke-outline" strokeWidth="2" strokeLinecap="round" />
                      <path d="M120 125 L180 125" className="stroke-outline" strokeWidth="2" strokeLinecap="round" />
                      <path d="M80 50 L80 100" className="stroke-outline" strokeWidth="2" strokeLinecap="round" />
                      <path d="M220 50 L220 100" className="stroke-outline" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="font-label-caps text-label-caps uppercase text-secondary">Metrological Rigor</div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Calibrated Dimensional Systems</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Whether converting metric newton-meters to foot-pounds or measuring apothecary volume against cubic decimeters, our conversion matrix operates without rounding drift or truncated constants.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9, 10, 11 & 12: 4 Pillars of Quality */}
        <section className="w-full py-space-2xl bg-surface-container-low">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="text-center max-w-3xl mx-auto mb-space-2xl space-y-space-2xs">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">Institutional Principles</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Engineered to Satisfy the Highest Quality Standards
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                In high-impact topics (Your Money or Your Life - YMYL), trust is earned through verifiable methodologies, continuous calibration, and unambiguous accountability.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm space-y-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary font-bold">
                    <span className="material-symbols-outlined text-[24px]">psychology</span>
                  </div>
                  <div>
                    <div className="font-label-caps text-label-caps uppercase text-primary">Pillar I</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Experience-Driven Design</h3>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Our workflows are designed from real consumer scenarios. Instead of confronting users with dry algebraic inputs, we structure tools around practical life milestones: refinancing a high-interest mortgage, projecting college funds, auditing a salary adjustment, or planning a kitchen recipe scaling. Every slider, tooltip, and variable field reflects human cognitive patterns.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm space-y-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary font-bold">
                    <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                  </div>
                  <div>
                    <div className="font-label-caps text-label-caps uppercase text-secondary">Pillar II</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Algorithmic Expertise</h3>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  All formulas are built using established formulas from financial engineering, standard physics, and statutory codes. We strictly reference standard financial textbooks, the Consumer Financial Protection Bureau (CFPB) guidelines, and standard IEEE rounding conventions to avoid compound distortion over multi-decade amortization horizons.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm space-y-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface font-bold">
                    <span className="material-symbols-outlined text-[24px]">menu_book</span>
                  </div>
                  <div>
                    <div className="font-label-caps text-label-caps uppercase text-on-surface">Pillar III</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Authoritative Provenance</h3>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  SolveItCalculator discloses the fundamental equations powering each calculator right on the workbench screen. Users can examine the LaTeX formulas, understand the variable definitions, and cross-reference our results against secondary benchmarks, reinforcing intellectual honesty and academic rigor.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm space-y-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold">
                    <span className="material-symbols-outlined text-[24px]">shield</span>
                  </div>
                  <div>
                    <div className="font-label-caps text-label-caps uppercase text-tertiary">Pillar IV</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Trustworthiness &amp; Hygiene</h3>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  We adhere to strict operational hygiene: no deceptive deceptive ads, no popups blocking calculation outputs, no selling of user profiles, and no hidden affiliate biases prioritizing one lender over another. Our dedicated email <a className="text-primary font-semibold hover:underline" href="mailto:info@solveitcalculator.com">info@solveitcalculator.com</a> provides an open line for audit reports and community feedback.
                </p>
              </div>
            </div>

            {/* Continuous Editorial & Rate Audit Policy */}
            <div className="mt-space-xl bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg">
                <div className="space-y-space-xs max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 font-label-caps text-label-caps uppercase text-primary">
                    <span className="material-symbols-outlined text-[16px]">sync</span>
                    <span>Continuous Maintenance Cycle</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Editorial Calibration &amp; Regulatory Reviews</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Tax brackets, social security wage bases, standard deduction allowances, and inflation metrics shift regularly. Our editorial team reviews statutory publications annually each Q1 and updates marginal calculation curves immediately upon statutory ratification.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md w-full lg:w-auto shrink-0 font-data-mono text-data-mono text-center">
                  <div className="bg-surface-container-low p-space-sm rounded-xl">
                    <div className="text-primary font-bold text-base">Annual</div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">Tax Bracket Review</div>
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-xl">
                    <div className="text-secondary font-bold text-base">Continuous</div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">Float Drift Audits</div>
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-xl col-span-2 sm:col-span-1">
                    <div className="text-on-surface font-bold text-base">&lt; 48 Hrs</div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">Bug Resolution SLA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 13 & 14: User-First Philosophy */}
        <section className="w-full py-space-2xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="bg-surface-container-low text-on-surface rounded-2xl p-space-xl lg:p-space-2xl overflow-hidden relative shadow-xl border border-surface-container-high/40">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full text-on-surface" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern height="40" id="grid-pattern-2" patternUnits="userSpaceOnUse" width="40">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"></path>
                    </pattern>
                  </defs>
                  <rect fill="url(#grid-pattern-2)" height="100%" width="100%"></rect>
                </svg>
              </div>
              <div className="relative z-10 max-w-3xl space-y-space-md">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full font-label-caps text-label-caps uppercase font-semibold">
                  Universal Usability
                </span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold tracking-tight">
                  Engineered for Low Latency, High Readability, and Zero Lag
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Mathematical tools should feel as reactive as a native physical scientific calculator. SolveItCalculator is coded with ultra-lean web standards—eschewing heavy framework payloads and telemetry bloat to load instantaneously even on low-bandwidth mobile connections globally.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md pt-space-xs font-body-sm text-body-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-primary font-semibold">
                      <span className="material-symbols-outlined text-[18px]">contrast</span>
                      <span>High Visual Contrast</span>
                    </div>
                    <p className="text-on-surface-variant text-xs">Calibrated against WCAG 2.1 AAA contrast ratios for optimal legibility across varying ambient lighting.</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-secondary font-semibold">
                      <span className="material-symbols-outlined text-[18px]">touch_app</span>
                      <span>Touch Target Ergonomics</span>
                    </div>
                    <p className="text-on-surface-variant text-xs">Generous 48px tactile input fields engineered for thumb reach and fast single-hand adjustments.</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-tertiary font-semibold">
                      <span className="material-symbols-outlined text-[18px]">offline_bolt</span>
                      <span>Zero Server Dependencies</span>
                    </div>
                    <p className="text-on-surface-variant text-xs">Once loaded in your browser cache, core tools calculate smoothly without persistent network connectivity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 15: Contact Us */}
        <section className="w-full py-space-xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-transparent">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                <div className="lg:col-span-8 space-y-space-sm">
                  <div className="inline-flex items-center gap-1.5 bg-primary-fixed text-primary px-3 py-1 rounded-full font-label-caps text-label-caps uppercase">
                    <span className="material-symbols-outlined text-[16px]">support_agent</span>
                    <span>Open Feedback Channels</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                    Have a Question, Feedback, Bug Report, or Calculation Suggestion?
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    We actively welcome peer reviews, mathematical challenge cases, educational partnership inquiries, and reports of rounding discrepancies. Our metrology engineering desk evaluates every submission with analytical rigor.
                  </p>
                  <div className="pt-space-xs flex flex-wrap items-center gap-space-md text-on-surface-variant font-body-sm text-body-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
                      <span>Response SLA: <strong>24 to 48 business hours</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">mark_email_read</span>
                      <span>Dedicated Review Desk</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
                  <div className="w-full bg-surface-container-low p-space-lg rounded-xl text-center space-y-space-sm shadow-sm">
                    <div className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Direct Metrology Contact</div>
                    <a className="inline-block font-data-mono text-base sm:text-lg font-bold text-primary hover:text-primary-container transition-colors break-all" href="mailto:info@solveitcalculator.com">
                      info@solveitcalculator.com
                    </a>
                    <p className="font-body-sm text-body-sm text-on-surface-variant/80 text-xs">
                      Exclusively verified support inbox. No automated spam redirects.
                    </p>
                    <a className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-space-md rounded-lg font-body-sm text-body-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm" href="mailto:info@solveitcalculator.com">
                      <span className="material-symbols-outlined text-[18px]">mail</span>
                      <span>Send Direct Inquiry</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-space-2xl bg-surface-container-low/50">
          <div className="max-w-max-width-calculator mx-auto px-gutter-mobile lg:px-0">
            <div className="text-center mb-space-xl space-y-space-2xs">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">Inquiries &amp; Clarifications</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Frequently Asked Questions
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Transparent answers detailing our technical architecture, business sustainability, and editorial standards.
              </p>
            </div>
            
            <div className="space-y-space-sm">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden transition-all duration-200">
                  <button
                    aria-expanded={openFaqs[idx] ? "true" : "false"}
                    className="w-full px-space-lg py-space-md text-left flex items-center justify-between gap-space-sm cursor-pointer select-none focus:outline-none"
                    onClick={() => toggleFaq(idx)}
                    type="button"
                  >
                    <span className="font-headline-md text-headline-md text-on-surface text-base md:text-lg">{faq.q}</span>
                    <span
                      className="material-symbols-outlined text-on-surface-variant transition-transform duration-200 text-[22px]"
                      style={{ transform: openFaqs[idx] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      expand_more
                    </span>
                  </button>
                  <div className={`faq-content px-space-lg pb-space-md pt-0 text-on-surface-variant font-body-sm text-body-sm leading-relaxed border-t border-surface-container-high/40 mt-1 ${openFaqs[idx] ? 'block' : 'hidden'}`}>
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
