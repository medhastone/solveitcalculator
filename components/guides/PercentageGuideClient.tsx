'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  Calculator,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  UserCheck,
  LayoutGrid,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import { GUIDES_DATA, GUIDE_CATEGORIES } from '@/lib/guidesData';

interface TocItem {
  id: string;
  number: string;
  label: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: 'what-is-a-percentage', number: '1.', label: 'What is a percentage?' },
  { id: 'percentage-formula', number: '2.', label: 'The percentage formula' },
  { id: 'step-by-step-example', number: '3.', label: 'Worked 15% of 250 walkthrough' },
  { id: 'field-notes', number: '4.', label: 'Practitioner field note' },
  { id: 'percentage-increase', number: '5.', label: 'Percentage increase' },
  { id: 'percentage-decrease', number: '6.', label: 'Percentage decrease' },
  { id: 'example-table', number: '7.', label: 'Reference benchmarks' },
  { id: 'common-mistakes', number: '8.', label: 'Common pitfalls' },
  { id: 'author-and-references', number: '9.', label: 'Author & references' },
  { id: 'faqs', number: '10.', label: 'FAQs' },
];

const EXAMPLE_TABLE_ROWS = [
  {
    percentage: '10%',
    number: '80',
    calculation: '10 × 80 ÷ 100',
    result: '8',
  },
  {
    percentage: '15%',
    number: '250',
    calculation: '15 × 250 ÷ 100',
    result: '37.5',
  },
  {
    percentage: '25%',
    number: '120',
    calculation: '25 × 120 ÷ 100',
    result: '30',
  },
  {
    percentage: '50%',
    number: '200',
    calculation: '50 × 200 ÷ 100',
    result: '100',
  },
  {
    percentage: '12.5%',
    number: '320',
    calculation: '12.5 × 320 ÷ 100',
    result: '40',
  },
];

const RELATED_CALCULATORS = [
  {
    name: 'Percentage Change Calculator',
    href: '/math/percentage-change-calculator',
  },
  {
    name: 'Discount Calculator',
    href: '/math/discount-calculator',
  },
  {
    name: 'Proportion Calculator',
    href: '/math/proportion-calculator',
  },
  {
    name: 'Percentage to Decimal',
    href: '/math/percentage-to-decimal-calculator',
  },
  {
    name: 'Percentage to Fraction',
    href: '/math/fraction-calculator',
  },
];

const GUIDE_FAQS = [
  {
    question: 'What is the easiest way to calculate a percentage?',
    answer:
      'Multiply the percentage by the whole number, then divide the product by 100. For example, to find 15% of 250, multiply 15 × 250 to get 3,750, and divide by 100 to get 37.5.',
  },
  {
    question: 'How do I calculate 20% of a number quickly?',
    answer:
      'First find 10% of the number by moving the decimal point one place to the left, then double that result. For example, 10% of 80 is 8, so 20% of 80 is 16.',
  },
  {
    question:
      'What is the difference between percentage change and percentage difference?',
    answer:
      'Percentage change measures how much an original value has increased or decreased over time (dividing by the original value). Percentage difference compares two independent numbers where neither is the starting value (dividing by the average of the two numbers).',
  },
];

export default function PercentageGuideClient() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>(
    'what-is-a-percentage'
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const mathSiblings = GUIDES_DATA.filter(
    (g) => g.category === 'Math & Percentages'
  );
  const prevGuide = GUIDES_DATA[GUIDES_DATA.length - 1];
  const nextGuide = GUIDES_DATA[1];

  const handleTocClick = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* Top Hero Banner with Breadcrumb, Guide Switcher, H1, Intro & Educational Illustration */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-b from-[#EDF3FF] via-[#F3F7FF] to-[#F5F7FA] pt-5 pb-7">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Row: Breadcrumb + Interactive Guide Switcher */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Breadcrumb: Home / Math Guides / Percentages */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-[#475569]"
            >
              <Link
                href="/"
                className="hover:text-[#2457D6] transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
              >
                Home
              </Link>
              <ChevronRight
                className="w-3.5 h-3.5 text-[#94A3B8]"
                aria-hidden="true"
              />
              <Link
                href="/guides"
                className="hover:text-[#2457D6] transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
              >
                Math Guides
              </Link>
              <ChevronRight
                className="w-3.5 h-3.5 text-[#94A3B8]"
                aria-hidden="true"
              />
              <span
                className="font-semibold text-[#152238]"
                aria-current="page"
              >
                Percentages
              </span>
            </nav>

            {/* Quick Guide Switcher + All Guides Link */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href="/guides"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CFE0FC] text-xs font-bold text-[#2457D6] hover:bg-[#EAF2FF] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>All {GUIDES_DATA.length} Guides</span>
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSwitcherOpen((prev) => !prev)}
                  aria-expanded={switcherOpen}
                  aria-label="Switch calculation guide"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#DCE5F2] hover:border-[#2457D6] text-xs font-semibold text-[#152238] shadow-2xs transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <BookOpen
                    className="w-3.5 h-3.5 text-[#2457D6]"
                    aria-hidden="true"
                  />
                  <span>Switch Guide (1/{GUIDES_DATA.length})</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#64748B] transition-transform ${
                      switcherOpen ? 'rotate-180 text-[#2457D6]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {switcherOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[420px] overflow-y-auto rounded-2xl bg-white border border-[#DCE5F2] shadow-xl p-3 z-50 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                      <span className="text-xs font-extrabold text-[#152238]">
                        Jump to Any Guide ({GUIDES_DATA.length})
                      </span>
                      <Link
                        href="/guides"
                        onClick={() => setSwitcherOpen(false)}
                        className="text-xs font-bold text-[#2457D6] hover:underline"
                      >
                        Browse Hub →
                      </Link>
                    </div>
                    {GUIDE_CATEGORIES.map((categoryName) => {
                      const items = GUIDES_DATA.filter(
                        (g) => g.category === categoryName
                      );
                      return (
                        <div key={categoryName} className="space-y-1">
                          <p className="text-[11px] font-bold text-[#64748B] px-2">
                            {categoryName}
                          </p>
                          {items.map((item) => {
                            const isCurrent =
                              item.slug === 'how-to-calculate-a-percentage';
                            return (
                              <button
                                key={item.slug}
                                type="button"
                                onClick={() => {
                                  setSwitcherOpen(false);
                                  router.push(`/guides/${item.slug}`);
                                }}
                                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                  isCurrent
                                    ? 'bg-[#EAF1FF] text-[#2457D6] font-bold'
                                    : 'text-[#152238] hover:bg-[#F5F7FA] font-medium'
                                }`}
                              >
                                <span className="truncate">{item.title}</span>
                                {isCurrent && (
                                  <span className="text-[11px] font-bold text-[#2457D6] shrink-0">
                                    Current
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Heading + Plain-English Lead */}
            <div className="max-w-3xl">
              <div className="flex items-center gap-3.5">
                <div
                  aria-hidden="true"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#EF5350] to-[#D32F2F] text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-sm shrink-0"
                >
                  %
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#152238] leading-tight">
                  How to Calculate a Percentage
                </h1>
              </div>

              <p className="mt-3.5 text-base sm:text-[17px] text-[#334155] leading-relaxed max-w-2xl">
                Learn what a percentage is, how to calculate a percentage of a
                number, and how to find percentage increase and decrease with
                clear examples and step-by-step explanations.
              </p>
            </div>

            {/* Right Clean Educational Graphic (Calculator + Ascending Bars + % Badge) */}
            <div
              aria-hidden="true"
              className="hidden lg:flex items-center justify-end shrink-0 select-none"
            >
              <div className="relative w-[290px] h-[150px] rounded-2xl bg-gradient-to-tr from-[#DCE9FF] via-[#EAF2FF] to-[#E6F6F1] border border-[#CFE0FC] shadow-xs flex items-center justify-center px-5 overflow-hidden">
                {/* Decorative background circles */}
                <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#2457D6]/10" />
                <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-[#16856B]/10" />

                {/* Mini Calculator Card */}
                <div className="relative z-10 w-28 bg-[#1E3A8A] rounded-xl p-2.5 shadow-md border border-[#3B82F6]/40 -rotate-3">
                  <div className="bg-[#DBEAFE] rounded-md px-2 py-1 text-right font-mono font-extrabold text-sm text-[#152238] mb-2">
                    37.5
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="h-3.5 rounded bg-[#93C5FD]/80" />
                    <span className="h-3.5 rounded bg-[#93C5FD]/80" />
                    <span className="h-3.5 rounded bg-[#60A5FA]" />
                    <span className="h-3.5 rounded bg-[#93C5FD]/60" />
                    <span className="h-3.5 rounded bg-[#93C5FD]/60" />
                    <span className="h-3.5 rounded bg-[#34D399]" />
                  </div>
                </div>

                {/* Rising Chart & Badges */}
                <div className="relative z-10 ml-4 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-8 h-8 rounded-full bg-[#16856B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      ✓
                    </span>
                    <span className="w-9 h-9 rounded-xl bg-[#2457D6] text-white flex items-center justify-center font-extrabold text-base shadow-xs rotate-6">
                      %
                    </span>
                  </div>
                  <div className="bg-white/95 border border-[#CFE0FC] rounded-xl px-3 py-2 shadow-xs flex items-end gap-1.5 h-16">
                    <span className="w-3 h-5 rounded-t bg-[#93C5FD]" />
                    <span className="w-3 h-8 rounded-t bg-[#60A5FA]" />
                    <span className="w-3 h-10 rounded-t bg-[#2457D6]" />
                    <span className="w-3 h-12 rounded-t bg-[#16856B]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Category Sibling Quick Pills */}
          <div className="mt-5 pt-4 border-t border-[#DCE5F2]/80 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-[#475569] whitespace-nowrap shrink-0">
              In Math &amp; Percentages:
            </span>
            {mathSiblings.map((sib) => {
              const isCurrent = sib.slug === 'how-to-calculate-a-percentage';
              return (
                <Link
                  key={sib.slug}
                  href={`/guides/${sib.slug}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                    isCurrent
                      ? 'bg-[#2457D6] text-white shadow-2xs'
                      : 'bg-white/90 text-[#152238] border border-[#DCE5F2] hover:border-[#2457D6] hover:text-[#2457D6]'
                  }`}
                >
                  {sib.shortTitle}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main 3-Column Educational Content Area */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Table of Contents (2 cols on lg) */}
          <aside
            aria-label="Table of contents"
            className="lg:col-span-2 lg:sticky lg:top-20 space-y-4"
          >
            <div className="bg-white rounded-2xl border border-[#DCE5F2] shadow-xs p-4">
              <h2 className="text-sm font-extrabold text-[#152238] pb-2.5 mb-2.5 border-b border-[#E2E8F0]">
                Table of contents
              </h2>
              <nav aria-label="Article sections">
                <ul className="space-y-1">
                  {TOC_ITEMS.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleTocClick(item.id);
                          }}
                          className={`group flex items-start gap-1.5 px-2.5 py-2 rounded-lg text-xs sm:text-[13px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                            isActive
                              ? 'bg-[#EAF1FF] text-[#2457D6] font-bold'
                              : 'text-[#334155] hover:bg-[#F5F7FA] hover:text-[#2457D6] font-medium'
                          }`}
                        >
                          <span
                            className={`shrink-0 tabular-nums ${
                              isActive
                                ? 'text-[#2457D6] font-bold'
                                : 'text-[#64748B]'
                            }`}
                          >
                            {item.number}
                          </span>
                          <span>{item.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Left Column Directory Link */}
            <div className="hidden lg:block bg-white rounded-2xl border border-[#DCE5F2] shadow-xs p-4">
              <p className="text-xs font-extrabold text-[#152238] mb-1.5">
                Explore All Guides
              </p>
              <p className="text-xs text-[#475569] leading-relaxed mb-3">
                Browse all {GUIDES_DATA.length} worked-example guides by topic
                or formula.
              </p>
              <Link
                href="/guides"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F9FF] hover:bg-[#E8F1FF] border border-[#C7DCFE] text-xs font-bold text-[#2457D6] transition-colors whitespace-nowrap"
              >
                <span>Open Guides Hub</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </aside>

          {/* CENTER COLUMN: Readable Main Article + Genuine Author Box (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            <article className="bg-white rounded-2xl border border-[#DCE5F2] shadow-xs p-6 sm:p-8 space-y-8">
              {/* Section 1: What is a percentage? */}
              <section
                id="what-is-a-percentage"
                aria-labelledby="heading-what-is"
                className="scroll-mt-24 space-y-3.5"
              >
                <h2
                  id="heading-what-is"
                  className="text-xl sm:text-2xl font-extrabold text-[#152238]"
                >
                  What is a percentage?
                </h2>
                <p className="text-[15px] sm:text-base text-[#334155] leading-relaxed">
                  A percentage is a way of expressing a number as a fraction of{' '}
                  <strong className="font-bold text-[#152238]">100</strong>. The
                  word &ldquo;percent&rdquo; comes from the Latin{' '}
                  <em>per centum</em> (&ldquo;by the hundred&rdquo;) and is
                  written with the{' '}
                  <strong className="font-bold text-[#152238]">%</strong>{' '}
                  symbol.
                </p>
                <p className="text-[15px] sm:text-base text-[#334155] leading-relaxed">
                  For example,{' '}
                  <strong className="font-bold text-[#152238]">25%</strong>{' '}
                  means 25 parts out of 100, which equals the decimal{' '}
                  <strong className="font-bold text-[#152238]">0.25</strong> or
                  one quarter (1/4) of any total quantity.
                </p>

                {/* Info Callout Box */}
                <div className="bg-[#F0F6FF] border border-[#CFE0FC] rounded-xl px-4 py-3.5 flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="w-5 h-5 rounded-full bg-[#2457D6] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  >
                    i
                  </span>
                  <p className="text-sm sm:text-[15px] text-[#152238] leading-relaxed">
                    A percentage can exceed{' '}
                    <strong className="font-bold">100%</strong> (for example,
                    200% means twice the starting amount) and can include
                    decimals such as{' '}
                    <strong className="font-bold">12.5%</strong>.
                  </p>
                </div>
              </section>

              <hr className="border-[#E2E8F0]" />

              {/* Section 2: The percentage formula */}
              <section
                id="percentage-formula"
                aria-labelledby="heading-formula"
                className="scroll-mt-24 space-y-4"
              >
                <h2
                  id="heading-formula"
                  className="text-xl sm:text-2xl font-extrabold text-[#152238]"
                >
                  The core percentage equation (Part, Whole &amp; Rate)
                </h2>
                <p className="text-[15px] sm:text-base text-[#334155] leading-relaxed">
                  To find a given percentage of any number, multiply the
                  percentage rate by the whole number and divide by 100:
                </p>

                {/* Highlighted Accessible Formula Box */}
                <div
                  role="region"
                  aria-label="Percentage formula"
                  className="bg-[#F2F7FF] border border-[#C7DCFE] rounded-xl py-4 px-5 text-center shadow-2xs"
                >
                  <p className="text-lg sm:text-[21px] font-extrabold tracking-tight text-[#152238]">
                    Result ={' '}
                    <span className="text-[#2457D6]">Percentage</span> × Number
                    ÷ 100
                  </p>
                </div>

                <ul className="space-y-2 pt-1">
                  <li className="flex items-start gap-2.5 text-[15px] sm:text-base text-[#334155]">
                    <CheckCircle2
                      className="w-5 h-5 text-[#16856B] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-bold text-[#152238]">
                        Percentage
                      </strong>{' '}
                      is the rate per hundred you are solving for (e.g., 15 for
                      15%).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 text-[15px] sm:text-base text-[#334155]">
                    <CheckCircle2
                      className="w-5 h-5 text-[#16856B] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-bold text-[#152238]">
                        Number
                      </strong>{' '}
                      is the base or starting total that represents 100%.
                    </span>
                  </li>
                </ul>
              </section>

              <hr className="border-[#E2E8F0]" />

              {/* Section 3: Step-by-step example */}
              <section
                id="step-by-step-example"
                aria-labelledby="heading-step-by-step"
                className="scroll-mt-24 space-y-4"
              >
                <h2
                  id="heading-step-by-step"
                  className="text-xl sm:text-2xl font-extrabold text-[#152238]"
                >
                  Worked walkthrough: finding 15% of 250
                </h2>
                <p className="text-[15px] sm:text-base text-[#334155]">
                  Let&apos;s walk through{' '}
                  <strong className="font-bold text-[#152238]">
                    15% of 250
                  </strong>{' '}
                  step by step.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-1">
                  {/* Left 4 numbered steps */}
                  <ol className="md:col-span-7 space-y-4">
                    <li className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="w-6 h-6 rounded-full bg-[#2457D6] text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5"
                      >
                        1
                      </span>
                      <div className="text-sm sm:text-[15px] text-[#334155] space-y-0.5">
                        <p className="font-bold text-[#152238]">
                          Identify the values:
                        </p>
                        <p className="tabular-nums">Percentage = 15</p>
                        <p className="tabular-nums">Number = 250</p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="w-6 h-6 rounded-full bg-[#2457D6] text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5"
                      >
                        2
                      </span>
                      <div className="text-sm sm:text-[15px] text-[#334155] space-y-0.5">
                        <p className="font-bold text-[#152238]">
                          Substitute into the formula:
                        </p>
                        <p className="tabular-nums font-medium text-[#152238]">
                          Result = 15 × 250 ÷ 100
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="w-6 h-6 rounded-full bg-[#2457D6] text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5"
                      >
                        3
                      </span>
                      <div className="text-sm sm:text-[15px] text-[#334155] space-y-0.5">
                        <p className="font-bold text-[#152238]">Calculate:</p>
                        <p className="tabular-nums">15 × 250 = 3,750</p>
                        <p className="tabular-nums">
                          3,750 ÷ 100 ={' '}
                          <strong className="font-bold text-[#152238]">
                            37.5
                          </strong>
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="w-6 h-6 rounded-full bg-[#2457D6] text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5"
                      >
                        4
                      </span>
                      <div className="text-sm sm:text-[15px] text-[#334155] space-y-0.5">
                        <p className="font-bold text-[#152238]">
                          Final answer:
                        </p>
                        <p className="tabular-nums font-extrabold text-[#16856B]">
                          15% of 250 = 37.5
                        </p>
                      </div>
                    </li>
                  </ol>

                  {/* Right Example Result Card */}
                  <div className="md:col-span-5 flex">
                    <div className="w-full rounded-xl bg-[#EBF7F4] border border-[#BDE5D7] p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 pb-3 border-b border-[#CBECE0]">
                          <CheckCircle2
                            className="w-5 h-5 text-[#16856B] shrink-0"
                            aria-hidden="true"
                          />
                          <span className="text-base font-extrabold text-[#152238]">
                            Verified result
                          </span>
                        </div>
                        <p className="mt-4 text-sm font-medium text-[#334155]">
                          15% of 250 is:
                        </p>
                        <p className="mt-1 text-4xl sm:text-[42px] font-extrabold text-[#16856B] tracking-tight tabular-nums">
                          37.5
                        </p>
                      </div>

                      <div className="mt-5 bg-white/95 border border-[#CDECE2] rounded-lg py-2.5 px-3 text-center">
                        <span className="text-sm font-bold text-[#152238] tabular-nums">
                          15 × 250 ÷ 100 = 37.5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-[#E2E8F0]" />

              {/* Practitioner Field Note */}
              <section
                id="field-notes"
                aria-labelledby="heading-field-notes"
                className="scroll-mt-24 rounded-2xl bg-[#F8FAFC] border border-[#DCE5F2] p-5 sm:p-6 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Compass
                    className="w-4 h-4 text-[#2457D6] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#2457D6]">
                    Practitioner Field Note · The Base-Shift Asymmetry Trap
                  </span>
                </div>
                <h2
                  id="heading-field-notes"
                  className="text-lg sm:text-xl font-extrabold text-[#152238] leading-snug"
                >
                  Why a 20% discount followed by a 20% price increase leaves you
                  at $96, not $100
                </h2>
                <p className="text-sm sm:text-[15px] text-[#334155] leading-relaxed">
                  Percentages are always anchored to the starting number of the
                  current step. If a $100 jacket goes on sale for 20% off, it
                  drops by $20 to $80. If the store raises the price by 20% the
                  next week, that 20% is calculated against the new $80 base
                  ($80 × 0.20 = $16), bringing the tag to $96—not $100. To climb
                  from $80 back to $100, you actually need a 25% increase ($20 ÷
                  $80 = 0.25).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertTriangle
                        className="w-4 h-4 text-[#D97706] shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#92400E]">
                        Common Pitfall
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#152238] mb-1">
                      Subtracting sales tax directly from a tax-inclusive receipt
                    </p>
                    <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                      If your receipt total is $108 including 8% tax, taking 8%
                      off $108 gives $99.36 (wrong). Divide by 1.08 instead:
                      $108 ÷ 1.08 = $100.00 pre-tax.
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle2
                        className="w-4 h-4 text-[#16856B] shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#065F46]">
                        Practitioner Tip
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-[#152238] mb-1">
                      The commutative mental-math swap (X% of Y = Y% of X)
                    </p>
                    <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                      Need 16% of 25 in your head? Flip it: 25% of 16 is one
                      quarter of 16, which is 4. Both expressions multiply the
                      same two numbers and divide by 100.
                    </p>
                  </div>
                </div>
              </section>

              <hr className="border-[#E2E8F0]" />

              {/* Section 4: How to calculate a percentage increase */}
              <section
                id="percentage-increase"
                aria-labelledby="heading-increase"
                className="scroll-mt-24 space-y-3.5"
              >
                <h2
                  id="heading-increase"
                  className="text-xl sm:text-2xl font-extrabold text-[#152238]"
                >
                  How to calculate a percentage increase
                </h2>
                <p className="text-[15px] sm:text-base text-[#334155] leading-relaxed">
                  To find the percentage increase from an original starting
                  value to a new higher value, divide the upward difference by
                  the original starting value:
                </p>

                <div
                  role="region"
                  aria-label="Percentage increase formula"
                  className="bg-[#F2F7FF] border border-[#C7DCFE] rounded-xl py-3.5 px-4 text-center"
                >
                  <p className="text-sm sm:text-base font-extrabold text-[#152238]">
                    Percentage Increase = (New Value – Original Value) ÷
                    Original Value × 100
                  </p>
                </div>

                <div className="space-y-2 pt-1 text-[15px] sm:text-base text-[#334155]">
                  <p>
                    <strong className="font-bold text-[#152238]">
                      Worked Scenario:
                    </strong>{' '}
                    A monthly subscription increases from{' '}
                    <strong className="font-bold text-[#152238]">$200</strong>{' '}
                    to{' '}
                    <strong className="font-bold text-[#152238]">$250</strong>.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 tabular-nums">
                    <li>Difference = 250 – 200 = 50</li>
                    <li>50 ÷ 200 = 0.25</li>
                    <li>
                      0.25 × 100 ={' '}
                      <strong className="font-extrabold text-[#16856B]">
                        25%
                      </strong>
                    </li>
                  </ul>
                  <p className="pt-1">
                    So the percentage increase is{' '}
                    <strong className="font-bold text-[#152238]">25%</strong>.
                    You can also verify this instantly with the{' '}
                    <Link
                      href="/math/percentage-change-calculator"
                      className="text-[#2457D6] font-semibold underline underline-offset-2 hover:text-[#1D47B0]"
                    >
                      Percentage Change Calculator
                    </Link>
                    .
                  </p>
                </div>
              </section>

              <hr className="border-[#E2E8F0]" />

              {/* Section 5: How to calculate a percentage decrease */}
              <section
                id="percentage-decrease"
                aria-labelledby="heading-decrease"
                className="scroll-mt-24 space-y-3.5"
              >
                <h2
                  id="heading-decrease"
                  className="text-xl sm:text-2xl font-extrabold text-[#152238]"
                >
                  How to calculate a percentage decrease
                </h2>
                <p className="text-[15px] sm:text-base text-[#334155] leading-relaxed">
                  To find the percentage decrease when a quantity drops, divide
                  the downward difference by the original starting value:
                </p>

                <div
                  role="region"
                  aria-label="Percentage decrease formula"
                  className="bg-[#F2F7FF] border border-[#C7DCFE] rounded-xl py-3.5 px-4 text-center"
                >
                  <p className="text-sm sm:text-base font-extrabold text-[#152238]">
                    Percentage Decrease = (Original Value – New Value) ÷
                    Original Value × 100
                  </p>
                </div>

                <div className="space-y-2 pt-1 text-[15px] sm:text-base text-[#334155]">
                  <p>
                    <strong className="font-bold text-[#152238]">
                      Worked Scenario:
                    </strong>{' '}
                    An item drops from{' '}
                    <strong className="font-bold text-[#152238]">$250</strong>{' '}
                    down to{' '}
                    <strong className="font-bold text-[#152238]">$200</strong>.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 tabular-nums">
                    <li>Difference = 250 – 200 = 50</li>
                    <li>50 ÷ 250 = 0.2</li>
                    <li>
                      0.2 × 100 ={' '}
                      <strong className="font-extrabold text-[#16856B]">
                        20%
                      </strong>
                    </li>
                  </ul>
                  <p className="pt-1">
                    So the percentage decrease is{' '}
                    <strong className="font-bold text-[#152238]">20%</strong>.
                    When comparing retail sale markdowns, try our{' '}
                    <Link
                      href="/math/discount-calculator"
                      className="text-[#2457D6] font-semibold underline underline-offset-2 hover:text-[#1D47B0]"
                    >
                      Discount Calculator
                    </Link>
                    .
                  </p>
                </div>
              </section>

              <hr className="border-[#E2E8F0]" />

              {/* Section 6: Examples Table */}
              <section
                id="example-table"
                aria-labelledby="heading-examples-table"
                className="scroll-mt-24 space-y-4"
              >
                <h2
                  id="heading-examples-table"
                  className="text-xl sm:text-2xl font-extrabold text-[#152238]"
                >
                  Everyday percentage reference benchmarks
                </h2>

                <div className="overflow-x-auto rounded-xl border border-[#DCE5F2]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F1F5FB] border-b border-[#DCE5F2] text-xs sm:text-sm font-extrabold text-[#152238]">
                        <th scope="col" className="py-3 px-4">
                          Percentage
                        </th>
                        <th scope="col" className="py-3 px-4">
                          Number
                        </th>
                        <th scope="col" className="py-3 px-4">
                          Calculation
                        </th>
                        <th scope="col" className="py-3 px-4">
                          Result
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-sm sm:text-[15px] tabular-nums">
                      {EXAMPLE_TABLE_ROWS.map((row) => (
                        <tr
                          key={`${row.percentage}-${row.number}`}
                          className="hover:bg-[#F8FAFC] transition-colors"
                        >
                          <td className="py-2.5 px-4 font-semibold text-[#152238]">
                            {row.percentage}
                          </td>
                          <td className="py-2.5 px-4 text-[#334155]">
                            {row.number}
                          </td>
                          <td className="py-2.5 px-4 text-[#334155]">
                            {row.calculation}
                          </td>
                          <td className="py-2.5 px-4 font-extrabold text-[#152238]">
                            {row.result}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <hr className="border-[#E2E8F0]" />

              {/* Section 7: Common mistakes */}
              <section
                id="common-mistakes"
                aria-labelledby="heading-common-mistakes"
                className="scroll-mt-24 space-y-3.5"
              >
                <h2
                  id="heading-common-mistakes"
                  className="text-xl sm:text-2xl font-extrabold text-[#152238]"
                >
                  Five percentage traps to watch out for
                </h2>
                <ul className="space-y-2.5">
                  {[
                    'Forgetting to divide by 100 (or shift the decimal two places left) before multiplying.',
                    'Dividing by the new ending value instead of the original starting value when finding percentage change.',
                    'Confusing percentage points (4% to 6% = +2 percentage points) with relative percentage change (+50%).',
                    'Subtracting sales tax from a tax-inclusive receipt instead of dividing by (1 + tax rate).',
                    'Rounding intermediate decimals too early during multi-step financial or scientific calculations.',
                  ].map((mistake) => (
                    <li
                      key={mistake}
                      className="flex items-start gap-2.5 text-[15px] sm:text-base text-[#334155]"
                    >
                      <CheckCircle2
                        className="w-5 h-5 text-[#16856B] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </article>

            {/* Section 8: Genuine Author Card (Below Main Article) */}
            <section
              id="author-and-references"
              aria-labelledby="heading-about-author"
              className="scroll-mt-24 bg-white rounded-2xl border border-[#DCE5F2] shadow-xs p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-xl">
                <h2
                  id="heading-about-author"
                  className="text-base font-extrabold text-[#152238]"
                >
                  About the author
                </h2>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2457D6] to-[#152238] text-white flex items-center justify-center font-extrabold text-lg shadow-xs shrink-0">
                    K
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-[#152238]">
                      Krchandan
                    </p>
                    <p className="text-xs sm:text-sm text-[#475569] font-medium">
                      Founder &amp; Writer, SolveItCalculator.com
                    </p>
                  </div>
                </div>
                <p className="text-sm sm:text-[15px] text-[#334155] leading-relaxed">
                  &ldquo;I create easy-to-understand guides and free calculators
                  to help people solve everyday problems with simple
                  explanations.&rdquo;
                </p>
              </div>

              {/* Right Author Graphic Badge */}
              <div
                aria-hidden="true"
                className="hidden sm:flex items-center justify-center w-28 h-24 rounded-2xl bg-gradient-to-br from-[#EEF4FF] to-[#E6F6F1] border border-[#CFE0FC] shrink-0"
              >
                <div className="flex flex-col items-center text-[#2457D6]">
                  <UserCheck className="w-8 h-8 text-[#2457D6]" />
                  <span className="mt-1 text-[11px] font-bold text-[#152238]">
                    Verified Guide
                  </span>
                </div>
              </div>
            </section>

            {/* Prev / Next Guide Switcher Footer Card */}
            <nav
              aria-label="Previous and next guides"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <Link
                href={`/guides/${prevGuide.slug}`}
                className="bg-white rounded-2xl border border-[#DCE5F2] hover:border-[#2457D6] p-4 shadow-xs flex items-center gap-3 transition-colors group"
              >
                <span className="w-9 h-9 rounded-xl bg-[#F0F5FF] text-[#2457D6] flex items-center justify-center shrink-0 group-hover:bg-[#2457D6] group-hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#64748B]">
                    Previous Guide
                  </p>
                  <p className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6] truncate">
                    {prevGuide.title}
                  </p>
                </div>
              </Link>

              <Link
                href={`/guides/${nextGuide.slug}`}
                className="bg-white rounded-2xl border border-[#DCE5F2] hover:border-[#2457D6] p-4 shadow-xs flex items-center justify-between gap-3 transition-colors group text-right"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[#64748B]">
                    Next Guide
                  </p>
                  <p className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6] truncate">
                    {nextGuide.title}
                  </p>
                </div>
                <span className="w-9 h-9 rounded-xl bg-[#F0F5FF] text-[#2457D6] flex items-center justify-center shrink-0 group-hover:bg-[#2457D6] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Link>
            </nav>
          </div>

          {/* RIGHT COLUMN: Contextual Calculator CTA, Related Links, Takeaways, FAQs & References (3 cols on lg) */}
          <aside
            aria-label="Related tools and key takeaways"
            className="lg:col-span-3 space-y-5"
          >
            {/* Card 1: Try the Percentage Calculator */}
            <div className="bg-gradient-to-b from-[#EBF3FF] to-[#F3F8FF] rounded-2xl border border-[#C7DCFE] p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2457D6] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Calculator className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#152238] leading-snug">
                    Try the Percentage Calculator
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[#334155] leading-relaxed">
                    Calculate percentages, increases, and decreases in seconds.
                  </p>
                </div>
              </div>

              <Link
                href="/math/percentage-calculator"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#2457D6] hover:bg-[#1D47B0] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
              >
                <span>Open Percentage Calculator</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Card 2: Related Calculators */}
            <div className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-xs">
              <h2 className="text-base font-extrabold text-[#152238] pb-2.5 mb-2.5 border-b border-[#E2E8F0]">
                Related Calculators
              </h2>
              <ul className="divide-y divide-[#F1F5F9]">
                {RELATED_CALCULATORS.map((calc) => (
                  <li key={calc.name}>
                    <Link
                      href={calc.href}
                      className="py-2.5 flex items-center justify-between gap-2 text-sm font-semibold text-[#2457D6] hover:text-[#1D47B0] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
                    >
                      <span className="flex items-center gap-2">
                        <ChevronRight
                          className="w-4 h-4 text-[#2457D6] shrink-0"
                          aria-hidden="true"
                        />
                        <span className="group-hover:underline">
                          {calc.name}
                        </span>
                      </span>
                      <ChevronRight
                        className="w-4 h-4 text-[#94A3B8] group-hover:translate-x-0.5 transition-transform shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3: Key takeaways */}
            <div className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-xs">
              <h2 className="text-base font-extrabold text-[#152238] pb-2.5 mb-3 border-b border-[#E2E8F0]">
                Key takeaways
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#334155]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#16856B] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    A percentage means{' '}
                    <strong className="font-bold text-[#152238]">
                      &ldquo;out of 100&rdquo;
                    </strong>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#16856B] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    Use{' '}
                    <strong className="font-bold text-[#152238]">
                      Result = Percentage × Number ÷ 100
                    </strong>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#16856B] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    Always divide by the{' '}
                    <strong className="font-bold text-[#152238]">
                      original value
                    </strong>{' '}
                    when calculating percentage increase or decrease.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#16856B] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    Convert percentages to decimals by dividing by{' '}
                    <strong className="font-bold text-[#152238]">100</strong>.
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 4: Need to explore more? */}
            <div className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-xs">
              <h2 className="text-base font-extrabold text-[#152238]">
                Need to explore more?
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                Check out all our free math calculators.
              </p>
              <Link
                href="/math"
                className="mt-3.5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#C7DCFE] bg-[#F5F9FF] hover:bg-[#E8F1FF] text-[#2457D6] font-bold text-xs sm:text-sm py-2.5 px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <span>View All Math Calculators</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Card 5: Frequently Asked Questions */}
            <div
              id="faqs"
              className="scroll-mt-24 bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-xs"
            >
              <h2 className="text-base font-extrabold text-[#152238] pb-2.5 mb-2 border-b border-[#E2E8F0]">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-[#E2E8F0]">
                {GUIDE_FAQS.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={faq.question} className="py-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaqIndex(isOpen ? null : index)
                        }
                        aria-expanded={isOpen}
                        className="w-full flex items-start justify-between gap-2 text-left text-xs sm:text-[13px] font-bold text-[#152238] hover:text-[#2457D6] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#64748B] shrink-0 mt-0.5 transition-transform ${
                            isOpen ? 'rotate-180 text-[#2457D6]' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {isOpen && (
                        <p className="mt-2 text-xs text-[#475569] leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 6: References */}
            <div className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-xs">
              <h2 className="text-sm font-extrabold text-[#152238] pb-2 mb-2 border-b border-[#E2E8F0]">
                References
              </h2>
              <ul className="list-disc pl-4 text-xs text-[#475569] leading-relaxed space-y-1">
                <li>
                  Standard arithmetic and percentage definitions used in general
                  mathematics education.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
