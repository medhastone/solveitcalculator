'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  User,
  CheckCircle2,
  XCircle,
  BookOpen,
  SlidersHorizontal,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Mail,
  FileCode2,
  Scale,
  History,
  Calculator,
  Clock,
} from 'lucide-react';

export interface AboutMethodologyClientProps {
  pageVariant?: 'about' | 'methodology';
}

const CATEGORY_FORMULAS = [
  {
    category: 'Finance & Loans',
    tools: 'Mortgage, Loan Amortization, Compound Interest, Savings Goal, FIRE Forecaster, 401(k), RMD, Roth vs. Traditional',
    formulas: [
      'Monthly Loan Payment: M = P × [r(1 + r)^n] ÷ [(1 + r)^n − 1], where P is principal, r is monthly nominal rate (annual rate ÷ 12), and n is total monthly payments.',
      'Compound Interest: A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) − 1) ÷ (r/n)].',
      'Real Rate of Return (Fisher Equation): r_real = [(1 + r_nominal) ÷ (1 + i_inflation)] − 1.',
      'Required Minimum Distribution (RMD): RMD = Prior Dec 31 Account Balance ÷ IRS Publication 590-B Life Expectancy Factor (Table III or Table II).',
    ],
    sources: [
      { label: 'CFPB Regulation Z (12 CFR Part 1026 — Truth in Lending)', url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/' },
      { label: 'IRS Publication 590-B (Distributions from IRAs)', url: 'https://www.irs.gov/publications/p590b' },
      { label: 'IRS Notice 2024-80 (2025 401(k) & IRA Contribution Limits)', url: 'https://www.irs.gov/pub/irs-drop/n-24-80.pdf' },
    ],
    howTested:
      'Tested in automated unit suites (__tests__/mortgage.test.ts, __tests__/finance-calculators.test.ts) against standard amortization schedules, zero-interest edge cases, extra principal prepayment horizons, and IRS Publication 590-B Table III/II lookup factors.',
  },
  {
    category: 'Tax & Payroll',
    tools: 'US Federal Tax, US State Take-Home, UK PAYE, Canada Income Tax, India Income Tax (New vs Old Regime), Germany, France, UAE, Singapore, Salary Calculator, Self-Employment, 1099 vs W-2, Bonus Tax',
    formulas: [
      'Progressive Bracket Tax: Sum over each statutory bracket i of max(0, min(TaxableIncome, Upper_i) − Lower_i) × Rate_i.',
      'US FICA Payroll Tax (2025): 6.2% Social Security up to the $176,100 wage base cap + 1.45% Medicare on all wages (+ 0.9% Additional Medicare Tax above statutory thresholds).',
      'UK PAYE Personal Allowance Taper (2025/26): £12,570 allowance reduced by £1 for every £2 of adjusted net income above £100,000 (reaching £0 at £125,140).',
      'India New Regime (FY 2025–26 u/s 115BAC): ₹75,000 salary standard deduction, progressive slabs, Section 87A rebate up to ₹12,00,000 taxable income with marginal relief, plus 4% Health & Education Cess.',
    ],
    sources: [
      { label: 'IRS Revenue Procedure 2024-40 (2025 Federal Tax Brackets & Standard Deductions)', url: 'https://www.irs.gov/pub/irs-drop/rp-24-40.pdf' },
      { label: 'SSA 2025 Social Security OASDI Wage Base ($176,100)', url: 'https://www.ssa.gov/news/press/factsheets/colafacts2025.pdf' },
      { label: 'GOV.UK HMRC Income Tax & National Insurance Rates (2025/26)', url: 'https://www.gov.uk/income-tax-rates' },
      { label: 'Canada Revenue Agency (CRA) 2025 Federal & Provincial Tax Brackets', url: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html' },
      { label: 'Income Tax Department India — Finance Act 2025 (FY 2025–26 / AY 2026–27)', url: 'https://www.incometaxindia.gov.in/' },
      { label: 'Australian Taxation Office (ATO) Resident Tax Rates 2024–25', url: 'https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents' },
    ],
    howTested:
      'Verified via unit tests (__tests__/salary-tax-engine.test.ts) across multiple income tiers ($0, standard deduction thresholds, social security wage caps, UK £100k taper zone, and India Section 87A marginal relief thresholds).',
  },
  {
    category: 'Health & Fitness',
    tools: 'BMI Calculator, TDEE Calculator, BMR Calculator, Body Fat Percentage (U.S. Navy), Ideal Weight Calculator',
    formulas: [
      'Body Mass Index (Metric & Imperial): BMI = Weight(kg) ÷ [Height(m)]² = 703 × Weight(lb) ÷ [Height(in)]².',
      'Mifflin-St Jeor BMR (1990): BMR = 10 × Weight(kg) + 6.25 × Height(cm) − 5 × Age(y) + s, where s = +5 for males and −161 for females.',
      'Total Daily Energy Expenditure (TDEE): TDEE = BMR × Physical Activity Level Multiplier (1.2 sedentary to 1.9 extra active).',
      'U.S. Navy Body Fat (Hodgdon & Beckett, 1984): Male BF% = 495 ÷ [1.0324 − 0.19077 × log10(waist − neck) + 0.15456 × log10(height)] − 450.',
      'Devine Ideal Weight (1974): 50 kg (male) or 45.5 kg (female) + 2.3 kg per inch of height over 60 inches.',
    ],
    sources: [
      { label: 'World Health Organization (WHO) Adult BMI Classification', url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight' },
      { label: 'CDC About Adult BMI', url: 'https://www.cdc.gov/bmi/adult-calculator/index.html' },
      { label: 'Mifflin MD, St Jeor ST et al. (1990) — Am J Clin Nutr 51(2):241–247', url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/' },
      { label: 'NHLBI / NIH Assessing Your Weight and Health Risk', url: 'https://www.nhlbi.nih.gov/health/educational/lose_wt/risk.htm' },
    ],
    howTested:
      'Tested in __tests__/bmi.test.ts for metric/imperial equivalence, WHO category boundary cutoffs (18.5, 25.0, 30.0), Mifflin-St Jeor male/female constants, and circumference validation.',
  },
  {
    category: 'Unit Conversions & Recipe Scaling',
    tools: 'Weight (kg to lbs), Length, Temperature, Volume, Area, Speed, Pressure, Energy, Data Storage, Fuel Economy, Recipe Converter',
    formulas: [
      'Internationalavoirdupois Pound & Inch (Exact by treaty): 1 lb = 0.45359237 kg (exact); 1 inch = 25.4 mm (exact).',
      'Temperature Affine Conversions: °F = (°C × 9/5) + 32; K = °C + 273.15.',
      'Fuel Economy Reciprocal Relationship: L/100 km = 235.214583 ÷ MPG (US); L/100 km = 282.480936 ÷ MPG (UK Imperial).',
      'Culinary Volume-to-Weight: Grams = Volume(mL) × Ingredient Bulk Density(g/mL) from USDA FoodData Central and King Arthur Baking tables.',
    ],
    sources: [
      { label: 'NIST Special Publication 811 (Guide for the Use of the International System of Units)', url: 'https://www.nist.gov/pml/special-publication-811' },
      { label: 'USDA FoodData Central (Ingredient Densities)', url: 'https://fdc.nal.usda.gov/' },
    ],
    howTested:
      'Tested in __tests__/conversions.test.ts and __tests__/recipe-converter.test.ts for round-trip symmetry, NIST SP 811 exact factors, and reciprocal fuel consumption math.',
  },
  {
    category: 'Math, Date & Time, and Construction',
    tools: 'Percentage Calculator, Age Calculator, Date Difference, Business Days, Time Duration, Construction & Flooring Calculators',
    formulas: [
      'Percentage Change: [(New − Old) ÷ |Old|] × 100.',
      'Gregorian Calendar Age & Date Span: Exact calendar year, month, and day decomposition accounting for actual month lengths (28/29/30/31 days) and leap years (divisible by 4, except centuries not divisible by 400).',
      'Concrete & Flooring Material Volume: Volume = Length × Width × Thickness × (1 + WasteFactor%).',
    ],
    sources: [
      { label: 'ISO 8601 Date and Time Representation Standard', url: 'https://www.iso.org/iso-8601-date-and-time-format.html' },
      { label: 'NIST Time and Frequency Division — Leap Year Rules', url: 'https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time/walk-through-time-ancient-calendars' },
    ],
    howTested:
      'Tested in __tests__/percentage.test.ts, __tests__/age-date-time.test.ts, __tests__/construction.test.ts, and __tests__/flooring.test.ts including Feb 29 leap-year birthdays and zero-division guards.',
  },
];

const METHODOLOGY_CHANGELOG = [
  {
    date: 'November 13, 2026',
    scope: 'Trust Signals, Source Citations & Editorial Policy',
    summary:
      'Added visible Last Updated dates, explicit tax/data years, primary source links (IRS, HMRC, CRA, ATO, CBDT, WHO, NIST SP 811), plain non-advice disclaimers on all finance, tax, and health tools, and direct Report an Error links.',
  },
  {
    date: 'November 10, 2026',
    scope: 'Tool Template & Worked Examples Rollout',
    summary:
      'Added above-the-fold one-line answers with real numbers, separated worked examples from live user results, and validated visible FAQPage and WebApplication structured data.',
  },
  {
    date: 'October 28, 2026',
    scope: 'Category Hubs & Clean URL Consolidation',
    summary:
      'Consolidated duplicate URLs with 301 redirects, promoted TDEE, BMR, Body Fat, and Ideal Weight to dedicated URLs, and restored Date & Time utility calculators.',
  },
  {
    date: 'April 6, 2025',
    scope: 'UK 2025/26 & India FY 2025–26 Statutory Tax Tables',
    summary:
      'Updated UK PAYE Class 1 National Insurance thresholds (2025/26) and India Finance Act 2025 New Tax Regime slabs (Section 115BAC ₹75,000 standard deduction and ₹12L Section 87A rebate).',
  },
  {
    date: 'January 15, 2025',
    scope: 'US 2025 & Canada 2025 Statutory Tax & Retirement Tables',
    summary:
      'Updated US Federal tax brackets and standard deductions per IRS Rev. Proc. 2024-40, 2025 Social Security wage base ($176,100), 401(k)/IRA limits per Notice 2024-80, and CRA 2025 federal/provincial brackets and CPP2 ceiling.',
  },
];

export default function AboutMethodologyClient({
  pageVariant = 'about',
}: AboutMethodologyClientProps) {
  const isMethodologyPage = pageVariant === 'methodology';

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* Hero Banner */}
      <section className="border-b border-[#E2E8F0] bg-gradient-to-b from-[#EAF2FF] via-[#F2F6FF] to-[#F5F7FA] pt-6 pb-8">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs sm:text-sm text-[#475569]"
          >
            <Link
              href="/"
              className="text-[#0A58ED] hover:underline font-medium"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" aria-hidden="true" />
            <span className="font-semibold text-[#152238]" aria-current="page">
              {isMethodologyPage ? 'Calculation Methodology' : 'About SolveItCalculator'}
            </span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#CBD5E1] text-xs font-bold text-[#1E3A8A]">
              <Clock className="w-3.5 h-3.5 text-[#0A58ED]" aria-hidden="true" />
              <span>Last updated: November 13, 2026</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#152238] leading-tight">
              {isMethodologyPage
                ? 'Calculation Methodology, Formulas & Testing'
                : 'About SolveItCalculator'}
            </h1>
            <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
              {isMethodologyPage
                ? 'This page documents the exact mathematical formulas, IEEE 754 floating-point rounding rules, default assumptions, automated test suites, and change log behind SolveItCalculator.com.'
                : 'SolveItCalculator.com builds free, browser-based calculators for finance, tax, health, unit conversions, math, date & time, and home projects—using published equations and primary statutory tables.'}
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Switcher between /about and /calculation-methodology */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-[#DCE5F2] p-4 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <Link
              href="/about"
              aria-current={!isMethodologyPage ? 'page' : undefined}
              className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
                !isMethodologyPage
                  ? 'bg-[#0A58ED] text-white'
                  : 'bg-[#F1F5F9] text-[#152238] hover:bg-[#E2E8F0]'
              }`}
            >
              About SolveItCalculator {!isMethodologyPage ? '(current page)' : ''}
            </Link>
            <Link
              href="/calculation-methodology"
              aria-current={isMethodologyPage ? 'page' : undefined}
              className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
                isMethodologyPage
                  ? 'bg-[#0A58ED] text-white'
                  : 'bg-[#F1F5F9] text-[#152238] hover:bg-[#E2E8F0]'
              }`}
            >
              Calculation Methodology {!isMethodologyPage ? '' : '(current page)'}
            </Link>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold">
            <Link
              href="/contact"
              className="text-[#0A58ED] hover:underline inline-flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Contact</span>
            </Link>
            <span className="text-[#CBD5E1]">•</span>
            <Link
              href="/contact#report-error"
              className="text-[#DC2626] hover:underline inline-flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Report an error</span>
            </Link>
          </div>
        </div>

        {!isMethodologyPage ? (
          /* =====================================================================
             /about VIEW — WHO RUNS THE SITE, WHAT WE DO/DON'T DO, TESTING, POLICY
          ===================================================================== */
          <div className="space-y-8">
            {/* 1. Who Runs the Site */}
            <section
              aria-labelledby="who-runs-heading"
              className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-8 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="who-runs-heading" className="text-xl font-extrabold text-[#152238]">
                    1. Who Runs SolveItCalculator
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Independent founder-operated site — no invented staff, reviewers, or credentials
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-[#334155] leading-relaxed">
                <p>
                  <strong>SolveItCalculator.com</strong> is independently founded, developed, and maintained by{' '}
                  <strong>Krchandan</strong> (Developer &amp; Editor). There are no other full-time team members,
                  and <strong>we do not have a credentialed CPA, CFP®, tax attorney, licensed engineer, or physician on staff</strong>.
                </p>
                <p>
                  Because we do not employ licensed financial, tax, or medical professionals, we never invent
                  fictional reviewers, review boards, or medical/financial bylines. Instead, every calculator on this
                  site shows the exact formula it runs, the effective tax or data year of any fixed lookup table, and
                  direct links to the primary public source (such as the IRS, HMRC, CRA, ATO, CBDT, WHO, or NIST Special
                  Publication 811) so you can check the underlying rule yourself.
                </p>
              </div>

              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
                <div>
                  <span className="font-extrabold text-[#152238]">Founder &amp; Developer:</span>{' '}
                  <span className="text-[#334155]">Krchandan</span>
                  <span className="mx-2 text-[#CBD5E1]">|</span>
                  <span className="font-extrabold text-[#152238]">Direct Email:</span>{' '}
                  <a
                    href="mailto:ckchandan9801@gmail.com"
                    className="text-[#0A58ED] font-semibold hover:underline"
                  >
                    ckchandan9801@gmail.com
                  </a>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 font-bold text-[#0A58ED] hover:underline"
                >
                  <span>Contact Form &amp; Error Reporting</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </section>

            {/* 2. What SolveItCalculator Does and Does Not Do */}
            <section
              aria-labelledby="does-and-does-not-heading"
              className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-8 shadow-2xs space-y-5"
            >
              <h2 id="does-and-does-not-heading" className="text-xl font-extrabold text-[#152238]">
                2. What SolveItCalculator Does — and Does Not Do
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#166534]">
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" aria-hidden="true" />
                    <span>What SolveItCalculator Does</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                    <li>
                      • <strong>Runs transparent math in your browser:</strong> Calculates loan schedules, tax bracket
                      estimates, health metrics, and unit conversions immediately without sign-ups or paywalls.
                    </li>
                    <li>
                      • <strong>Shows the formula and worked example:</strong> Displays the equation, a step-by-step
                      example with real numbers, and the assumptions used.
                    </li>
                    <li>
                      • <strong>Cites primary public sources:</strong> Links directly to official government and
                      standards documents (IRS, SSA, HMRC, CRA, ATO, CBDT, CFPB, WHO, CDC, NIST SP 811) with the
                      applicable tax or data year stated on the page.
                    </li>
                    <li>
                      • <strong>Protects input privacy:</strong> Executes calculations client-side in your browser;
                      salary, loan, tax, or health numbers you type are not stored in a database.
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#991B1B]">
                    <XCircle className="w-5 h-5 text-[#DC2626] shrink-0" aria-hidden="true" />
                    <span>What SolveItCalculator Does Not Do</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                    <li>
                      • <strong>Does not provide financial, tax, or legal advice:</strong> Tax and loan calculators
                      produce educational estimates based on standard statutory tables; they cannot account for every
                      personal deduction, local surtax, or lender underwriting rule.
                    </li>
                    <li>
                      • <strong>Does not provide medical or clinical advice:</strong> BMI, BMR, TDEE, body fat, and
                      ideal weight tools are general screening estimates, not clinical diagnoses.
                    </li>
                    <li>
                      • <strong>Does not claim credentialed staff review:</strong> We have no CPA, CFP®, attorney, or
                      physician on staff and never present automated calculations as professional advice.
                    </li>
                    <li>
                      • <strong>Does not sell or harvest your calculator inputs:</strong> We do not require account
                      registration or collect financial/health form entries.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. How Tools Are Built and Tested */}
            <section
              aria-labelledby="built-and-tested-heading"
              className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-8 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="built-and-tested-heading" className="text-xl font-extrabold text-[#152238]">
                    3. How Tools Are Built and Tested
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Primary specification sourcing, automated unit tests, and edge-case checks
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-[#334155]">
                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-2">
                  <div className="font-extrabold text-[#152238]">Step 1: Primary Source Specification</div>
                  <p className="leading-relaxed">
                    Before writing code for a calculator, we gather the formula or statutory schedule from primary
                    publications—such as NIST Special Publication 811 for unit conversion factors, IRS Revenue
                    Procedures for US federal tax bands, HMRC/CRA/ATO/CBDT schedules for international taxes, and
                    peer-reviewed equations (Mifflin-St Jeor 1990, Devine 1974, Hodgdon &amp; Beckett 1984) for body
                    metrics.
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-2">
                  <div className="font-extrabold text-[#152238]">Step 2: Automated Unit Test Suites</div>
                  <p className="leading-relaxed">
                    Core math engines live in pure TypeScript modules tested against worked examples from official
                    guides. Our test suite checks standard scenarios, boundary thresholds (such as tax bracket edges,
                    Social Security wage caps, and leap-year dates), and invalid/zero input handling before deployment.
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-2">
                  <div className="font-extrabold text-[#152238]">Step 3: Assumption &amp; Date Labelling</div>
                  <p className="leading-relaxed">
                    Where a calculation depends on fixed tables (such as tax brackets, RMD life-expectancy factors, or
                    contribution limits), we display the source document, effective tax/data year, and last-updated date
                    directly on the tool page and next to the table.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/calculation-methodology"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0A58ED] hover:underline"
                >
                  <span>Read our full Calculation Methodology, Rounding Rules &amp; Change Log</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </section>

            {/* 4. Editorial Policy */}
            <section
              aria-labelledby="editorial-policy-heading"
              className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-8 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="editorial-policy-heading" className="text-xl font-extrabold text-[#152238]">
                    4. Editorial Policy
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Standards for accuracy, citations, updates, and independence
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[#334155] leading-relaxed">
                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-1.5">
                  <h3 className="font-extrabold text-[#152238]">Checkable Sources Over Unprovable Claims</h3>
                  <p>
                    We do not use vague marketing claims like &ldquo;100% accurate&rdquo; or &ldquo;expert
                    certified.&rdquo; Instead, we state the specific formula or statutory table used and link to the
                    primary source so readers can verify every constant.
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-1.5">
                  <h3 className="font-extrabold text-[#152238]">No Invented Bylines or Reviewers</h3>
                  <p>
                    All content and code are written and maintained by founder Krchandan. We never attach fictitious
                    names, stock-photo personas, or invented review desks to any calculator or guide.
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-1.5">
                  <h3 className="font-extrabold text-[#152238]">Annual Statutory Table Updates</h3>
                  <p>
                    Tax brackets, standard deductions, social insurance caps, and retirement limits change annually.
                    Each tax and retirement tool displays the exact tax year modeled (for example, 2025 US Federal or
                    2025/26 UK PAYE) and when the page was last updated.
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-1.5">
                  <h3 className="font-extrabold text-[#152238]">Editorial Independence</h3>
                  <p>
                    Calculator formulas, defaults, and outputs are never altered by advertisers or sponsors. Every tool
                    is free to use and produces neutral mathematical results based solely on your inputs.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. How to Report Errors */}
            <section
              aria-labelledby="report-errors-heading"
              className="bg-gradient-to-b from-[#FFF9F9] to-white rounded-2xl border border-[#FECACA] p-6 sm:p-8 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="report-errors-heading" className="text-xl font-extrabold text-[#152238]">
                    5. How to Report a Calculation Error
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    How we investigate, fix, and log reported bugs or outdated tax tables
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#334155] leading-relaxed">
                If you spot a calculation discrepancy, rounding issue, broken link, or outdated statutory threshold on
                any page, please report it. Every tool page includes a visible{' '}
                <strong>&ldquo;Report an error&rdquo;</strong> link in its trust bar and footer.
              </p>

              <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-[#334155]">
                <li>
                  Open our{' '}
                  <Link href="/contact#report-error" className="font-bold text-[#0A58ED] hover:underline">
                    Report a Calculation Error form
                  </Link>{' '}
                  or email{' '}
                  <a href="mailto:ckchandan9801@gmail.com" className="font-bold text-[#0A58ED] hover:underline">
                    ckchandan9801@gmail.com
                  </a>
                  .
                </li>
                <li>
                  Include the calculator name/URL, the exact input values you entered, the result shown, and the result
                  (or primary source document) you expected.
                </li>
                <li>
                  We reproduce the calculation against the primary standard, update the engine and unit tests if an
                  error is confirmed, and record the fix in the{' '}
                  <Link href="/calculation-methodology#change-log" className="font-bold text-[#0A58ED] hover:underline">
                    Calculation Methodology Change Log
                  </Link>
                  .
                </li>
              </ol>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/contact#report-error"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  <span>Report a Calculation Error</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#152238] border border-[#CBD5E1] text-xs sm:text-sm font-bold transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#0A58ED]" aria-hidden="true" />
                  <span>General Contact &amp; Feedback</span>
                </Link>
              </div>
            </section>
          </div>
        ) : (
          /* =====================================================================
             /calculation-methodology VIEW — FORMULAS, ROUNDING, ASSUMPTIONS,
             HOW EACH CATEGORY IS TESTED, AND VISIBLE CHANGE LOG
          ===================================================================== */
          <div className="space-y-8">
            {/* 1. Formulas & Testing by Category */}
            <section
              aria-labelledby="category-formulas-heading"
              className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-8 shadow-2xs space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0">
                  <Calculator className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="category-formulas-heading" className="text-xl font-extrabold text-[#152238]">
                    1. Formulas, Primary Sources &amp; How Each Category Is Tested
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Core equations, authoritative reference documents, and verification tests per category
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {CATEGORY_FORMULAS.map((cat) => (
                  <div
                    key={cat.category}
                    className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
                      <h3 className="text-base font-extrabold text-[#152238]">{cat.category}</h3>
                      <span className="text-xs text-[#64748B]">{cat.tools}</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-[#475569]">
                        Core Formulas
                      </div>
                      <ul className="space-y-1.5 text-xs sm:text-sm font-mono text-[#1E293B] bg-white p-3.5 rounded-lg border border-[#E2E8F0]">
                        {cat.formulas.map((f) => (
                          <li key={f} className="leading-relaxed">
                            • {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div>
                        <div className="text-xs font-extrabold uppercase tracking-wider text-[#475569] mb-1.5">
                          Primary Reference Sources
                        </div>
                        <ul className="space-y-1 text-xs">
                          {cat.sources.map((src) => (
                            <li key={src.url}>
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[#0A58ED] font-semibold hover:underline"
                              >
                                <span>{src.label}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="text-xs font-extrabold uppercase tracking-wider text-[#475569] mb-1.5">
                          How This Category Is Tested
                        </div>
                        <p className="text-xs text-[#334155] leading-relaxed">{cat.howTested}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Rounding Rules & Floating-Point Precision */}
            <section
              aria-labelledby="rounding-rules-heading"
              className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-8 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0">
                  <FileCode2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="rounding-rules-heading" className="text-xl font-extrabold text-[#152238]">
                    2. Rounding Rules &amp; Numerical Precision
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    How intermediate floating-point math and final display rounding are handled
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-[#334155] leading-relaxed">
                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-1.5">
                  <h3 className="font-extrabold text-[#152238]">Unrounded Intermediate Math</h3>
                  <p>
                    All internal calculations run in IEEE 754 double-precision (64-bit) floating-point arithmetic. We
                    never round monthly interest rates (e.g., 6.5% ÷ 12 = 0.0054166667...) or unit conversion factors
                    during intermediate steps.
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-1.5">
                  <h3 className="font-extrabold text-[#152238]">Currency &amp; Tax Rounding</h3>
                  <p>
                    Loan payments and pay-period breakdowns round to 2 decimal places (cents/pence) at display time.
                    Annual tax summaries round to the nearest whole currency unit or 2 decimal places matching the
                    applicable statutory schedule.
                  </p>
                </div>

                <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-1.5">
                  <h3 className="font-extrabold text-[#152238]">Unit &amp; Physical Constants</h3>
                  <p>
                    Unit converters use exact international definitions where established (such as 1 lb = 0.45359237 kg
                    and 1 in = 25.4 mm from NIST SP 811) and format outputs to 2–6 significant decimals based on
                    magnitude.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Default Assumptions & Scope Limitations */}
            <section
              aria-labelledby="assumptions-heading"
              className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-8 shadow-2xs space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="assumptions-heading" className="text-xl font-extrabold text-[#152238]">
                    3. Default Assumptions &amp; Scope Limitations
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    What our default parameters assume and what is outside calculator scope
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#334155] leading-relaxed">
                <p>
                  Every financial, tax, or health model requires baseline assumptions. Whenever a calculator uses a
                  default assumption, we expose that parameter as an editable input or state it next to the output:
                </p>
                <ul className="space-y-2 pl-4 list-disc">
                  <li>
                    <strong>Tax &amp; Take-Home Calculators:</strong> Default to standard deductions and single/default
                    filing status for the stated tax year unless you select itemized deductions, pension/401(k)
                    deferrals, or another filing status. Local municipal wage taxes, AMT, NIIT, and complex K-1
                    pass-through rules are excluded unless explicitly listed.
                  </li>
                  <li>
                    <strong>Mortgage &amp; Loan Calculators:</strong> Assume fixed-rate, fully amortizing monthly
                    compounding loans unless adjusted. Property taxes, homeowners insurance, HOA dues, and PMI are
                    optional user-editable inputs and vary by county and lender.
                  </li>
                  <li>
                    <strong>Retirement &amp; Compound Growth Calculators:</strong> Project constant annual or monthly
                    rates of return for mathematical comparison; actual market returns fluctuate and sequence-of-returns
                    risk can materially alter real-world outcomes.
                  </li>
                  <li>
                    <strong>Health &amp; Body Metrics:</strong> Apply adult population equations (ages 20+ for WHO BMI).
                    They do not account for athletic muscle mass, pregnancy, edema, or pediatric growth percentiles.
                  </li>
                </ul>
              </div>
            </section>

            {/* 4. Visible Change Log */}
            <section
              id="change-log"
              aria-labelledby="changelog-heading"
              className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-8 shadow-2xs space-y-4 scroll-mt-24"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0">
                  <History className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="changelog-heading" className="text-xl font-extrabold text-[#152238]">
                    4. Visible Change Log
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Dated record of tax-year updates, formula revisions, and trust improvements
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] font-extrabold">
                      <th className="py-3 px-4 whitespace-nowrap">Date</th>
                      <th className="py-3 px-4">Area / Calculators Updated</th>
                      <th className="py-3 px-4">Summary of Changes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
                    {METHODOLOGY_CHANGELOG.map((entry) => (
                      <tr key={entry.date + entry.scope} className="hover:bg-[#F8FAFC]">
                        <td className="py-3 px-4 font-mono font-bold text-[#152238] whitespace-nowrap">
                          {entry.date}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#152238]">{entry.scope}</td>
                        <td className="py-3 px-4 leading-relaxed">{entry.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Related Legal & Trust Links (Fixed '(this page)' label) */}
        <section
          aria-label="Related site policies and pages"
          className="bg-white rounded-2xl border border-[#DCE5F2] p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm"
        >
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-extrabold text-[#152238]">Related Pages:</span>
            <Link
              href="/about"
              className="font-bold text-[#0A58ED] hover:underline"
            >
              About SolveItCalculator {!isMethodologyPage ? '(current page)' : ''}
            </Link>
            <Link
              href="/calculation-methodology"
              className="font-bold text-[#0A58ED] hover:underline"
            >
              Calculation Methodology {isMethodologyPage ? '(current page)' : ''}
            </Link>
            <Link href="/privacy-policy" className="font-bold text-[#0A58ED] hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="font-bold text-[#0A58ED] hover:underline">
              Terms of Service
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="font-bold text-[#0A58ED] hover:underline">
              Contact
            </Link>
            <Link href="/contact#report-error" className="font-bold text-[#DC2626] hover:underline">
              Report an error
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
