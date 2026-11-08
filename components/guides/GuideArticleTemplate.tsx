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
import {
  GuideArticleData,
  GUIDES_DATA,
  GUIDE_CATEGORIES,
} from '@/lib/guidesData';
import { resolveHumanEditorialProfile } from '@/lib/humanEditorialCatalog';

interface GuideArticleTemplateProps {
  guide: GuideArticleData;
}

function stripLeadingNumber(heading: string): string {
  return heading.replace(/^\d+\.\s*/, '');
}

export default function GuideArticleTemplate({
  guide,
}: GuideArticleTemplateProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>('section-1');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const currentIndex = Math.max(
    0,
    GUIDES_DATA.findIndex((g) => g.slug === guide.slug)
  );
  const guideOrderVariant = (currentIndex % 4) as 0 | 1 | 2 | 3;
  const isAltColumnOrder = currentIndex % 2 === 1;

  const editorialProfile = resolveHumanEditorialProfile({
    slug: guide.slug,
    title: guide.title,
    categoryName: guide.category,
  });

  const baseArticleSections = [
    {
      id: 'section-1',
      tocLabel: guide.tocLabels.s1,
      node: (
        <section
          key="section-1"
          id="section-1"
          aria-labelledby="heading-section-1"
          className="scroll-mt-24 space-y-3.5"
        >
          <h2
            id="heading-section-1"
            className="text-xl sm:text-2xl font-extrabold text-[#152238]"
          >
            {stripLeadingNumber(guide.section1.heading)}
          </h2>
          {guide.section1.paragraphs.map((p, idx) => (
            <p
              key={idx}
              className="text-[15px] sm:text-base text-[#334155] leading-relaxed"
            >
              {p}
            </p>
          ))}

          {/* Info Callout Box */}
          <div className="bg-[#F0F6FF] border border-[#CFE0FC] rounded-xl px-4 py-3.5 flex items-start gap-3">
            <span
              aria-hidden="true"
              className="w-5 h-5 rounded-full bg-[#2457D6] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
            >
              i
            </span>
            <p className="text-sm sm:text-[15px] text-[#152238] leading-relaxed font-medium">
              {guide.section1.callout}
            </p>
          </div>
        </section>
      ),
    },
    {
      id: 'section-2',
      tocLabel: guide.tocLabels.s2,
      node: (
        <section
          key="section-2"
          id="section-2"
          aria-labelledby="heading-section-2"
          className="scroll-mt-24 space-y-4"
        >
          <h2
            id="heading-section-2"
            className="text-xl sm:text-2xl font-extrabold text-[#152238]"
          >
            {stripLeadingNumber(guide.section2.heading)}
          </h2>
          <p className="text-[15px] sm:text-base text-[#334155] leading-relaxed">
            {guide.section2.intro}
          </p>

          {/* Highlighted Accessible Formula Box */}
          <div
            role="region"
            aria-label="Primary calculation formula"
            className="bg-[#F2F7FF] border border-[#C7DCFE] rounded-xl py-4 px-5 text-center shadow-2xs"
          >
            <p className="text-lg sm:text-[21px] font-extrabold tracking-tight text-[#152238] tabular-nums">
              {guide.section2.formulaPrefix}
              <span className="text-[#2457D6]">
                {guide.section2.formulaHighlight}
              </span>
              {guide.section2.formulaSuffix}
            </p>
          </div>

          <ul className="space-y-2 pt-1">
            {guide.section2.variables.map((v) => (
              <li
                key={v.term}
                className="flex items-start gap-2.5 text-[15px] sm:text-base text-[#334155]"
              >
                <CheckCircle2
                  className="w-5 h-5 text-[#16856B] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-bold text-[#152238]">
                    {v.term}
                  </strong>{' '}
                  {v.definition}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ),
    },
    {
      id: 'section-3',
      tocLabel: guide.tocLabels.s3,
      node: (
        <section
          key="section-3"
          id="section-3"
          aria-labelledby="heading-section-3"
          className="scroll-mt-24 space-y-4"
        >
          <h2
            id="heading-section-3"
            className="text-xl sm:text-2xl font-extrabold text-[#152238]"
          >
            {stripLeadingNumber(guide.section3.heading)}
          </h2>
          <p className="text-[15px] sm:text-base text-[#334155]">
            Let&apos;s walk through{' '}
            <strong className="font-bold text-[#152238]">
              {guide.section3.exampleTask}
            </strong>
            .
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch pt-1">
            {/* Left numbered steps */}
            <ol className="md:col-span-7 space-y-4">
              {guide.section3.steps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="w-6 h-6 rounded-full bg-[#2457D6] text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5"
                  >
                    {index + 1}
                  </span>
                  <div className="text-sm sm:text-[15px] text-[#334155] space-y-0.5">
                    <p className="font-bold text-[#152238]">
                      {step.title}
                    </p>
                    {step.lines.map((line, lIdx) => {
                      const isLastHighlighted =
                        step.highlightLastLine &&
                        lIdx === step.lines.length - 1;
                      return (
                        <p
                          key={line}
                          className={`tabular-nums ${
                            isLastHighlighted
                              ? 'font-extrabold text-[#16856B]'
                              : ''
                          }`}
                        >
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </li>
              ))}
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
                    {guide.section3.resultPrompt}
                  </p>
                  <p className="mt-1 text-3xl sm:text-4xl font-extrabold text-[#16856B] tracking-tight tabular-nums">
                    {guide.section3.resultBigValue}
                  </p>
                </div>

                <div className="mt-5 bg-white/95 border border-[#CDECE2] rounded-lg py-2.5 px-3 text-center">
                  <span className="text-xs sm:text-sm font-bold text-[#152238] tabular-nums">
                    {guide.section3.resultEquation}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 'field-notes',
      tocLabel: 'Practitioner field note',
      node: (
        <section
          key="field-notes"
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
              {editorialProfile.fieldNote.kicker}
            </span>
          </div>
          <h2
            id="heading-field-notes"
            className="text-lg sm:text-xl font-extrabold text-[#152238] leading-snug"
          >
            {editorialProfile.fieldNote.heading}
          </h2>
          <p className="text-sm sm:text-[15px] text-[#334155] leading-relaxed">
            {editorialProfile.fieldNote.body}
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
                {editorialProfile.fieldNote.commonMistakeTitle}
              </p>
              <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                {editorialProfile.fieldNote.commonMistakeText}
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
                {editorialProfile.fieldNote.proTipTitle}
              </p>
              <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                {editorialProfile.fieldNote.proTipText}
              </p>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 'section-4',
      tocLabel: guide.tocLabels.s4,
      node: (
        <section
          key="section-4"
          id="section-4"
          aria-labelledby="heading-section-4"
          className="scroll-mt-24 space-y-3.5"
        >
          <h2
            id="heading-section-4"
            className="text-xl sm:text-2xl font-extrabold text-[#152238]"
          >
            {stripLeadingNumber(guide.section4.heading)}
          </h2>
          <p className="text-[15px] sm:text-base text-[#334155] leading-relaxed">
            {guide.section4.intro}
          </p>

          <div
            role="region"
            aria-label="Secondary formula"
            className="bg-[#F2F7FF] border border-[#C7DCFE] rounded-xl py-3.5 px-4 text-center"
          >
            <p className="text-sm sm:text-base font-extrabold text-[#152238] tabular-nums">
              {guide.section4.formula}
            </p>
          </div>

          <div className="space-y-2 pt-1 text-[15px] sm:text-base text-[#334155]">
            <p>
              <strong className="font-bold text-[#152238]">
                Worked Scenario:
              </strong>{' '}
              {guide.section4.exampleLead}
            </p>
            <ul className="list-disc pl-5 space-y-1 tabular-nums">
              {guide.section4.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="pt-1">
              {guide.section4.closingText}{' '}
              <Link
                href={guide.section4.ctaLinkHref}
                className="text-[#2457D6] font-semibold underline underline-offset-2 hover:text-[#1D47B0]"
              >
                {guide.section4.ctaLinkText}
              </Link>
              .
            </p>
          </div>
        </section>
      ),
    },
    {
      id: 'section-5',
      tocLabel: guide.tocLabels.s5,
      node: (
        <section
          key="section-5"
          id="section-5"
          aria-labelledby="heading-section-5"
          className="scroll-mt-24 space-y-3.5"
        >
          <h2
            id="heading-section-5"
            className="text-xl sm:text-2xl font-extrabold text-[#152238]"
          >
            {stripLeadingNumber(guide.section5.heading)}
          </h2>
          <p className="text-[15px] sm:text-base text-[#334155] leading-relaxed">
            {guide.section5.intro}
          </p>

          <div
            role="region"
            aria-label="Additional scenario formula"
            className="bg-[#F2F7FF] border border-[#C7DCFE] rounded-xl py-3.5 px-4 text-center"
          >
            <p className="text-sm sm:text-base font-extrabold text-[#152238] tabular-nums">
              {guide.section5.formula}
            </p>
          </div>

          <div className="space-y-2 pt-1 text-[15px] sm:text-base text-[#334155]">
            <p>
              <strong className="font-bold text-[#152238]">
                Worked Scenario:
              </strong>{' '}
              {guide.section5.exampleLead}
            </p>
            <ul className="list-disc pl-5 space-y-1 tabular-nums">
              {guide.section5.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="pt-1">
              {guide.section5.closingText}{' '}
              <Link
                href={guide.section5.ctaLinkHref}
                className="text-[#2457D6] font-semibold underline underline-offset-2 hover:text-[#1D47B0]"
              >
                {guide.section5.ctaLinkText}
              </Link>
              .
            </p>
          </div>
        </section>
      ),
    },
    {
      id: 'section-6',
      tocLabel: guide.tocLabels.s6,
      node: (
        <section
          key="section-6"
          id="section-6"
          aria-labelledby="heading-section-6"
          className="scroll-mt-24 space-y-4"
        >
          <h2
            id="heading-section-6"
            className="text-xl sm:text-2xl font-extrabold text-[#152238]"
          >
            {stripLeadingNumber(guide.section6.heading)}
          </h2>

          <div className="overflow-x-auto rounded-xl border border-[#DCE5F2]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F1F5FB] border-b border-[#DCE5F2] text-xs sm:text-sm font-extrabold text-[#152238]">
                  {guide.section6.headers.map((header) => (
                    <th key={header} scope="col" className="py-3 px-4">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm sm:text-[15px] tabular-nums">
                {guide.section6.rows.map((row, idx) => (
                  <tr
                    key={`${row.col1}-${idx}`}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="py-2.5 px-4 font-semibold text-[#152238]">
                      {row.col1}
                    </td>
                    <td className="py-2.5 px-4 text-[#334155]">
                      {row.col2}
                    </td>
                    <td className="py-2.5 px-4 text-[#334155]">
                      {row.col3}
                    </td>
                    <td className="py-2.5 px-4 font-extrabold text-[#152238]">
                      {row.col4}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ),
    },
    {
      id: 'section-7',
      tocLabel: guide.tocLabels.s7,
      node: (
        <section
          key="section-7"
          id="section-7"
          aria-labelledby="heading-section-7"
          className="scroll-mt-24 space-y-3.5"
        >
          <h2
            id="heading-section-7"
            className="text-xl sm:text-2xl font-extrabold text-[#152238]"
          >
            {stripLeadingNumber(guide.section7.heading)}
          </h2>
          <ul className="space-y-2.5">
            {guide.section7.mistakes.map((mistake) => (
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
      ),
    },
  ];

  // 4 distinct editorial structures so every guide does not share the exact same section flow
  const orderedArticleSections = (() => {
    const [s1, s2, s3, fieldNote, s4, s5, s6, s7] = baseArticleSections;
    switch (guideOrderVariant) {
      case 1:
        // Worked-example & reference table lead before deep variations
        return [s1, s3, s2, s6, fieldNote, s4, s5, s7];
      case 2:
        // Formula & field note lead right after concept intro
        return [s2, s1, fieldNote, s3, s4, s5, s7, s6];
      case 3:
        // Reference benchmarks & scenario comparisons before common pitfalls
        return [s1, s2, s6, s3, s4, s5, fieldNote, s7];
      case 0:
      default:
        return [s1, s2, s3, fieldNote, s4, s5, s6, s7];
    }
  })();

  const tocItems = [
    ...orderedArticleSections.map((sec, idx) => ({
      id: sec.id,
      number: `${idx + 1}.`,
      label: sec.tocLabel,
    })),
    {
      id: 'author-and-references',
      number: `${orderedArticleSections.length + 1}.`,
      label: guide.tocLabels.s8,
    },
    {
      id: 'faqs',
      number: `${orderedArticleSections.length + 2}.`,
      label: guide.tocLabels.s9,
    },
  ];

  const prevGuide =
    currentIndex > 0
      ? GUIDES_DATA[currentIndex - 1]
      : GUIDES_DATA[GUIDES_DATA.length - 1];
  const nextGuide =
    currentIndex < GUIDES_DATA.length - 1
      ? GUIDES_DATA[currentIndex + 1]
      : GUIDES_DATA[0];

  const categorySiblings = GUIDES_DATA.filter(
    (g) => g.category === guide.category
  );

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
                {guide.breadcrumbCategory}
              </Link>
              <ChevronRight
                className="w-3.5 h-3.5 text-[#94A3B8]"
                aria-hidden="true"
              />
              <span
                className="font-semibold text-[#152238]"
                aria-current="page"
              >
                {guide.shortTitle}
              </span>
            </nav>

            {/* Quick Guide Switcher + All Guides Link */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href="/guides"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#CFE0FC] text-xs font-bold text-[#2457D6] hover:bg-[#EAF2FF] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>All 13 Guides</span>
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
                  <span>Switch Guide ({currentIndex + 1}/{GUIDES_DATA.length})</span>
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
                            const isCurrent = item.slug === guide.slug;
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
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${guide.badgeGradient} text-white flex items-center justify-center font-extrabold text-lg sm:text-2xl shadow-sm shrink-0 px-2`}
                >
                  {guide.badgeSymbol}
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-[38px] font-extrabold tracking-tight text-[#152238] leading-tight">
                  {guide.title}
                </h1>
              </div>

              <p className="mt-3.5 text-base sm:text-[17px] text-[#334155] leading-relaxed max-w-2xl">
                {guide.heroIntro}
              </p>
            </div>

            {/* Right Clean Educational Graphic (Calculator + Ascending Bars + Symbol Badge) */}
            <div
              aria-hidden="true"
              className="hidden lg:flex items-center justify-end shrink-0 select-none"
            >
              <div className="relative w-[290px] h-[150px] rounded-2xl bg-gradient-to-tr from-[#DCE9FF] via-[#EAF2FF] to-[#E6F6F1] border border-[#CFE0FC] shadow-xs flex items-center justify-center px-5 overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-[#2457D6]/10" />
                <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-[#16856B]/10" />

                {/* Mini Calculator Card */}
                <div className="relative z-10 w-28 bg-[#1E3A8A] rounded-xl p-2.5 shadow-md border border-[#3B82F6]/40 -rotate-3">
                  <div className="bg-[#DBEAFE] rounded-md px-2 py-1 text-right font-mono font-extrabold text-xs text-[#152238] mb-2 truncate tabular-nums">
                    {guide.heroCalcScreenValue}
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
                    <span className="px-2 h-9 rounded-xl bg-[#2457D6] text-white flex items-center justify-center font-extrabold text-xs shadow-xs rotate-6">
                      {guide.badgeSymbol}
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
              In {guide.category}:
            </span>
            {categorySiblings.map((sib) => {
              const isCurrent = sib.slug === guide.slug;
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
          {/* TABLE OF CONTENTS COLUMN (2 cols on lg) */}
          <aside
            aria-label="Table of contents"
            className={`lg:col-span-2 lg:sticky lg:top-20 space-y-4 ${
              isAltColumnOrder ? 'lg:order-3' : 'lg:order-1'
            }`}
          >
            <div className="bg-white rounded-2xl border border-[#DCE5F2] shadow-xs p-4">
              <h2 className="text-sm font-extrabold text-[#152238] pb-2.5 mb-2.5 border-b border-[#E2E8F0]">
                Article Outline
              </h2>
              <nav aria-label="Article sections">
                <ul className="space-y-1">
                  {tocItems.map((item) => {
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
                Browse all 13 worked-example guides by topic or formula.
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

          {/* CENTER COLUMN: Readable Main Article + Genuine Author Box + Prev/Next Guide Nav (7 cols on lg) */}
          <div className="lg:col-span-7 lg:order-2 space-y-6">
            <article className="bg-white rounded-2xl border border-[#DCE5F2] shadow-xs p-6 sm:p-8 space-y-8">
              {orderedArticleSections.map((sec, idx) => (
                <React.Fragment key={sec.id}>
                  {idx > 0 && <hr className="border-[#E2E8F0]" />}
                  {sec.node}
                </React.Fragment>
              ))}
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
            className={`lg:col-span-3 space-y-5 ${
              isAltColumnOrder ? 'lg:order-1' : 'lg:order-3'
            }`}
          >
            {/* Card 1: Primary Calculator CTA */}
            <div className="bg-gradient-to-b from-[#EBF3FF] to-[#F3F8FF] rounded-2xl border border-[#C7DCFE] p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2457D6] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Calculator className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#152238] leading-snug">
                    {guide.sidebar.ctaTitle}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[#334155] leading-relaxed">
                    {guide.sidebar.ctaDescription}
                  </p>
                </div>
              </div>

              <Link
                href={guide.sidebar.ctaHref}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#2457D6] hover:bg-[#1D47B0] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
              >
                <span>{guide.sidebar.ctaButtonLabel}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Card 2: Related Calculators */}
            <div className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-xs">
              <h2 className="text-base font-extrabold text-[#152238] pb-2.5 mb-2.5 border-b border-[#E2E8F0]">
                Related Calculators
              </h2>
              <ul className="divide-y divide-[#F1F5F9]">
                {guide.sidebar.relatedCalculators.map((calc) => (
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
                {guide.sidebar.keyTakeaways.map((takeaway) => (
                  <li key={takeaway} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-[#16856B] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 4: Need to explore more? */}
            <div className="bg-white rounded-2xl border border-[#DCE5F2] p-5 shadow-xs">
              <h2 className="text-base font-extrabold text-[#152238]">
                Need to explore more?
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                {guide.sidebar.exploreDescription}
              </p>
              <Link
                href={guide.sidebar.exploreHref}
                className="mt-3.5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#C7DCFE] bg-[#F5F9FF] hover:bg-[#E8F1FF] text-[#2457D6] font-bold text-xs sm:text-sm py-2.5 px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <span>{guide.sidebar.exploreButtonLabel}</span>
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
                {guide.sidebar.faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={faq.question} className="py-2.5">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
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
                {guide.sidebar.references.map((refText) => (
                  <li key={refText}>{refText}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
