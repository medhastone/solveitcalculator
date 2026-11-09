import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ShieldCheck, Scale, AlertCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service & Educational Disclaimer | SolveItCalculator',
  description:
    'Read the Terms of Service, acceptable use guidelines, and educational disclaimer for using calculators, formulas, and reference tables on SolveItCalculator.com.',
  alternates: {
    canonical: 'https://solveitcalculator.com/terms-of-service',
  },
  openGraph: {
    title: 'Terms of Service & Educational Disclaimer | SolveItCalculator',
    description: 'Read the Terms of Service, acceptable use guidelines, and educational disclaimer for using calculators, formulas, and reference tables on SolveItCalculator.com.',
    url: 'https://solveitcalculator.com/terms-of-service',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service & Educational Disclaimer | SolveItCalculator',
    description: 'Read the Terms of Service, acceptable use guidelines, and educational disclaimer for using calculators, formulas, and reference tables on SolveItCalculator.com.',
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#152238] py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Card */}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2457D6]">
            <Scale className="w-4 h-4" aria-hidden="true" />
            <span>Legal &amp; Editorial Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#152238]">
            Terms of Service &amp; Educational Disclaimer
          </h1>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            Welcome to SolveItCalculator.com. By accessing or using our online calculators,
            conversion utilities, worked examples, and reference tables, you agree to the terms
            and conditions outlined on this page.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
            <span>Last Updated: November 2026</span>
            <span>•</span>
            <Link href="/privacy-policy" className="text-[#2457D6] font-semibold hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/calculation-methodology"
              className="text-[#2457D6] font-semibold hover:underline"
            >
              Calculation Methodology
            </Link>
          </div>
        </section>

        {/* Core Sections */}
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-6 text-sm text-[#334155] leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-[#152238] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#2457D6]" aria-hidden="true" />
              1. Educational &amp; Informational Purpose Only (No Professional Advice)
            </h2>
            <p>
              Every calculator, formula, benchmark table, and practitioner field note published on
              SolveItCalculator.com is provided strictly for general educational, informational, and
              estimation purposes. Nothing on this website constitutes formal financial, tax,
              accounting, legal, medical, nutritional, or structural engineering advice.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#475569]">
              <li>
                <strong className="text-[#152238]">Finance &amp; Tax Calculators:</strong> Statutory
                tax brackets, standard deductions, and payroll withholding formulas are simplified
                models. Always consult a Certified Public Accountant (CPA), Chartered Accountant, or
                your national revenue authority before filing returns or making investment decisions.
              </li>
              <li>
                <strong className="text-[#152238]">Health &amp; Fitness Calculators:</strong> BMI,
                BMR, TDEE, and calorie estimates are population screening equations and are not a
                substitute for clinical diagnosis or advice from a licensed physician.
              </li>
              <li>
                <strong className="text-[#152238]">Construction &amp; Engineering Tools:</strong>{' '}
                Material volume, square footage, and bag counts are planning estimates. Always verify
                structural load requirements, local building codes, and site measurements with a
                licensed contractor or engineer before ordering materials.
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#E2E8F0]">
            <h2 className="text-lg font-extrabold text-[#152238] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#16856B]" aria-hidden="true" />
              2. Accuracy Standards &amp; Limitation of Liability
            </h2>
            <p>
              Our editorial and engineering team benchmarks calculator algorithms against primary
              standards—including NIST Special Publication 811 for unit conversions, published IRS /
              HMRC / ATO / CRA / CBDT tax schedules, and peer-reviewed equations. However, rounding
              conventions, sub-national regulatory updates, or user input assumptions can affect real
              outcomes.
            </p>
            <p>
              SolveItCalculator.com provides all tools on an &ldquo;as-is&rdquo; and
              &ldquo;as-available&rdquo; basis without warranties of any kind. Under no
              circumstances shall SolveItCalculator be liable for any direct, indirect, or
              consequential loss arising from reliance on calculation outputs.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#E2E8F0]">
            <h2 className="text-lg font-extrabold text-[#152238] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2457D6]" aria-hidden="true" />
              3. Acceptable Use &amp; Intellectual Property
            </h2>
            <p>
              You may freely use our calculators, print or copy calculation results, and link to any
              page on SolveItCalculator.com for personal, academic, or commercial day-to-day work.
              Automated scraping, bulk republication of our proprietary editorial guides, or
              redistribution of our source code without written permission is prohibited.
            </p>
          </div>
        </section>

        {/* Bottom Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-[#E2E8F0] p-5 text-xs sm:text-sm">
          <span className="text-[#475569]">
            Have a question about a specific formula or noticed an edge case?
          </span>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 font-bold text-[#2457D6] hover:underline"
          >
            <span>Contact Our Editorial Team</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}
