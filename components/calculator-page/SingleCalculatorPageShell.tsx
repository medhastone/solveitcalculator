'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  Check,
  Copy,
  Printer,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Settings,
  FileText,
  Lightbulb,
  HelpCircle,
  LayoutGrid,
  BookOpen,
  Sigma,
  Tag,
  Coins,
  ArrowLeftRight,
  Percent,
  Scale,
  Clock,
  Activity,
  BarChart3,
  Share2,
  Hash,
  Table,
  ShieldCheck,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import {
  resolveHumanEditorialProfile,
  ensureMinimumSearchFaqs,
} from '@/lib/humanEditorialCatalog';
import { useCurrency, formatExchangeRate } from '@/lib/currency';
import GlobalFinanceCurrencyBar from '@/components/finance-suite/GlobalFinanceCurrencyBar';

export type SidebarIconVariant =
  | 'chart-green'
  | 'tag-amber'
  | 'coins-gold'
  | 'arrows-blue'
  | 'fraction-purple'
  | 'percent-coral'
  | 'calc-blue'
  | 'scale-teal'
  | 'clock-indigo'
  | 'heart-rose';

export interface RelatedCalculatorLink {
  name: string;
  description: string;
  href: string;
  iconVariant?: SidebarIconVariant;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ReferenceTableRow {
  scenarioLabel: string;
  multiplierLabel: string;
  calculatedOutput: string;
  formulaNote: string;
}

export interface SingleCalculatorShellProps {
  /** Breadcrumb items e.g. [{ label: 'Home', href: '/' }, { label: 'Math', href: '/math' }, { label: 'Percentage Calculators' }] */
  breadcrumbs: { label: string; href?: string }[];
  /** Main title words: last word will be highlighted in #2457D6 blue unless titleHighlight is explicitly provided */
  title: string;
  titleHighlight?: string;
  subtitle: string;
  /** Symbol or short text inside the left hero badge and right 3D illustration badge (e.g. '%', '$', 'BMI', '÷') */
  heroSymbol?: string;
  heroBadgeBg?: string;
  heroBadgeColor?: string;
  /** Category link for the "Need a different calculator?" CTA card */
  categoryName: string;
  categoryHref: string;
  otherCalculatorsTitle: string;
  otherCalculators: RelatedCalculatorLink[];
  relatedCalculators: RelatedCalculatorLink[];
  /** Interactive calculator card content (either custom children or standard panel) */
  calculatorCard: React.ReactNode;
  /** Render calculatorCard full-width (12 cols) when the client component already contains its own 2-column Input + Live Result layout */
  fullWidthWorkbench?: boolean;
  /** Optional Green Result Card props (if rendered by the shell; falls back to a consistent placeholder state when empty or omitted) */
  resultCard?: {
    promptSummary: string; // e.g. "25% of 200"
    promptSuffix?: string; // e.g. "is:"
    mainValue: string; // e.g. "50"
    equation: string; // e.g. "50 = 25 × 200 ÷ 100"
    secondaryNote?: string;
    isEmpty?: boolean;
    placeholderMessage?: string;
  };
  /** Formula & Example side-by-side card */
  formulaCard: {
    introText: string;
    formulaText: string;
    exampleTitle: string;
    exampleSteps: string[];
  };
  /** How to use (4 steps) */
  howToUseSteps: string[];
  /** How the calculation works */
  howItWorks: {
    paragraph: string;
    formulaBox: string;
    closingNote: string;
  };
  /** Understanding your result */
  understandingResult: {
    paragraph: React.ReactNode;
  };
  /** Frequently asked questions */
  faqs: FaqItem[];
  /** Optional custom quick-reference rows */
  referenceTableRows?: ReferenceTableRow[];
  /** Optional companion content rendered directly underneath the input calculator card in the left column of #workbench */
  leftColumnSupplement?: React.ReactNode;
  /** Optional companion content rendered directly underneath the green result card in the right column of #workbench */
  rightColumnSupplement?: React.ReactNode;
  /** Optional full-width content rendered directly below the 2-column #workbench (keeps reference tables out of the left input column) */
  belowWorkbenchContent?: React.ReactNode;
}

function SidebarIconBadge({ variant = 'chart-green' }: { variant?: SidebarIconVariant }) {
  switch (variant) {
    case 'chart-green':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#E6F6F1] text-[#16856B] flex items-center justify-center shrink-0">
          <BarChart3 className="w-5 h-5" />
        </div>
      );
    case 'tag-amber':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#FFF4E5] text-[#D97706] flex items-center justify-center shrink-0">
          <Tag className="w-5 h-5" />
        </div>
      );
    case 'coins-gold':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
          <Coins className="w-5 h-5" />
        </div>
      );
    case 'arrows-blue':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0">
          <ArrowLeftRight className="w-5 h-5" />
        </div>
      );
    case 'fraction-purple':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center shrink-0 font-extrabold text-sm">
          ½
        </div>
      );
    case 'percent-coral':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center shrink-0">
          <Percent className="w-5 h-5" />
        </div>
      );
    case 'scale-teal':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#E6F6F1] text-[#0D9488] flex items-center justify-center shrink-0">
          <Scale className="w-5 h-5" />
        </div>
      );
    case 'clock-indigo':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      );
    case 'heart-rose':
      return (
        <div className="w-10 h-10 rounded-xl bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5" />
        </div>
      );
    case 'calc-blue':
    default:
      return (
        <div className="w-10 h-10 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5" />
        </div>
      );
  }
}

export default function SingleCalculatorPageShell({
  breadcrumbs,
  title,
  titleHighlight,
  subtitle,
  heroSymbol = '%',
  heroBadgeBg = 'bg-[#FFE4E6]',
  heroBadgeColor = 'text-[#E11D48]',
  categoryName,
  categoryHref,
  otherCalculatorsTitle,
  otherCalculators,
  relatedCalculators,
  calculatorCard,
  fullWidthWorkbench = false,
  resultCard,
  formulaCard,
  howToUseSteps,
  howItWorks,
  understandingResult,
  faqs,
  referenceTableRows,
  leftColumnSupplement,
  rightColumnSupplement,
  belowWorkbenchContent,
}: SingleCalculatorShellProps) {
  const pathname = usePathname();
  const { currency, symbol: globalCurrencySymbol, rates, applyExchangeRate } =
    useCurrency();
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const isFinanceCalculator =
    categoryHref.startsWith('/finance') ||
    categoryName.toLowerCase().includes('finance') ||
    Boolean(pathname?.startsWith('/finance'));

  const isOutsideFinanceLayout =
    isFinanceCalculator && !pathname?.startsWith('/finance');

  const displayHeroSymbol =
    isFinanceCalculator &&
    ['$', '£', '€', '₹', 'CA$', 'S$', 'A$', 'AED'].includes(heroSymbol.trim())
      ? globalCurrencySymbol
      : heroSymbol;

  const fullTitle = titleHighlight ? `${title} ${titleHighlight}` : title;

  const editorialProfile = useMemo(
    () =>
      resolveHumanEditorialProfile({
        slug: pathname || title,
        title: fullTitle,
        categoryName,
      }),
    [pathname, title, fullTitle, categoryName]
  );

  // Split title into leading words (#152238) and highlighted trailing word (#2457D6)
  const renderHighlightedTitle = () => {
    if (titleHighlight) {
      return (
        <>
          <span className="text-[#152238]">{title} </span>
          <span className="text-[#2457D6]">{titleHighlight}</span>
        </>
      );
    }
    const words = title.trim().split(/\s+/);
    if (words.length <= 1) {
      return <span className="text-[#152238]">{title}</span>;
    }
    const lastWord = words[words.length - 1];
    const firstPart = words.slice(0, -1).join(' ');
    return (
      <>
        <span className="text-[#152238]">{firstPart} </span>
        <span className="text-[#2457D6]">{lastWord}</span>
      </>
    );
  };

  const handleCopyResult = () => {
    if (!resultCard) return;
    const textToCopy = `${resultCard.promptSummary} ${resultCard.promptSuffix ?? 'is:'} ${resultCard.mainValue} (${resultCard.equation})`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl =
      typeof window !== 'undefined'
        ? window.location.href
        : `https://solveitcalculator.com${pathname || ''}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      });
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Authentic domain benchmark table (either explicit custom referenceTableRows or curated domain benchmarkTable from editorialProfile)
  const activeBenchmarkTable = useMemo(() => {
    if (referenceTableRows && referenceTableRows.length > 0) {
      return {
        heading: editorialProfile.benchmarkTable.heading,
        subheading: editorialProfile.benchmarkTable.subheading,
        columns: [
          'Scenario / Input',
          'Parameter / Factor',
          'Calculated Value',
          'Verification Math',
        ] as [string, string, string, string],
        rows: referenceTableRows.map((r) => ({
          col1: r.scenarioLabel,
          col2: r.multiplierLabel,
          col3: r.calculatedOutput,
          col4: r.formulaNote,
        })),
      };
    }
    return editorialProfile.benchmarkTable;
  }, [referenceTableRows, editorialProfile]);

  const enrichedFaqs = useMemo(() => {
    const cleanSlug =
      (pathname || title)
        .split('/')
        .filter(Boolean)
        .pop()
        ?.toLowerCase() || '';
    return ensureMinimumSearchFaqs(
      faqs,
      {
        slug: cleanSlug,
        title: fullTitle,
        categoryName,
        formulaText: formulaCard.formulaText,
        exampleTitle: formulaCard.exampleTitle,
        exampleSteps: formulaCard.exampleSteps,
        fieldNote: editorialProfile.fieldNote,
        benchmarkRows: activeBenchmarkTable.rows,
      },
      7
    );
  }, [
    faqs,
    pathname,
    title,
    fullTitle,
    categoryName,
    formulaCard,
    editorialProfile.fieldNote,
    activeBenchmarkTable.rows,
  ]);

  // Automatic Schema.org JSON-LD graph (SoftwareApplication + HowTo + FAQPage + BreadcrumbList)
  const canonicalUrl = `https://solveitcalculator.com${pathname || ''}`;
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: fullTitle,
        description: subtitle,
        url: canonicalUrl,
        applicationCategory:
          categoryHref === '/finance' ? 'FinanceApplication' : 'UtilitiesApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'HowTo',
        name: editorialProfile.headings.howToUseH2,
        description: subtitle,
        step: howToUseSteps.map((stepText, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: `Step ${idx + 1}`,
          text: stepText,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.label,
          item: crumb.href
            ? `https://solveitcalculator.com${crumb.href}`
            : canonicalUrl,
        })),
      },
      ...(enrichedFaqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: enrichedFaqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  const hasValidResult = Boolean(
    resultCard &&
      !resultCard.isEmpty &&
      resultCard.mainValue &&
      resultCard.mainValue.trim() !== '' &&
      resultCard.mainValue.trim() !== '—' &&
      !resultCard.mainValue.includes('NaN') &&
      !resultCard.mainValue.toLowerCase().includes('invalid')
  );

  const renderedResultCard = (
    <section
      id="live-result-card"
      role="status"
      aria-live="polite"
      aria-label="Your calculation result"
      className={`scroll-mt-24 rounded-2xl border p-6 sm:p-7 shadow-2xs min-h-[268px] flex flex-col justify-between gap-4 transition-colors ${
        hasValidResult
          ? 'bg-[#ECFDF5] border-[#A7F3D0]'
          : 'bg-[#F8FAFC] border-[#CBD5E1]'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            aria-hidden="true"
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
              hasValidResult
                ? 'bg-[#16A34A] text-white'
                : 'bg-[#E2E8F0] text-[#475569]'
            }`}
          >
            {hasValidResult ? (
              <Check className="w-5 h-5 stroke-[2.75]" />
            ) : (
              <Calculator className="w-5 h-5" />
            )}
          </div>
          <div>
            <div
              className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider mb-1 ${
                hasValidResult ? 'text-[#065F46]' : 'text-[#475569]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  hasValidResult ? 'bg-[#16A34A]' : 'bg-[#94A3B8]'
                }`}
              />
              {hasValidResult
                ? 'Verified Output'
                : 'Awaiting Input · Ready to Calculate'}
            </div>
            <h2 className="text-lg font-extrabold text-[#152238]">
              Your result
            </h2>
            <p className="text-sm sm:text-base text-[#152238] mt-0.5">
              {hasValidResult && resultCard ? (
                <>
                  <span className="font-bold text-[#16856B]">
                    {resultCard.promptSummary}
                  </span>{' '}
                  <span className="font-semibold">
                    {resultCard.promptSuffix ?? 'is:'}
                  </span>
                </>
              ) : (
                <span className="text-[#475569] font-medium">
                  {resultCard?.placeholderMessage ||
                    'Enter or adjust values in the calculator panel to compute your result:'}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Copy result & Print buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!hasValidResult}
            onClick={handleCopyResult}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed border border-[#CBD5E1] text-xs font-bold text-[#2457D6] shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16856B]" />
                <span className="text-[#16856B]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy result</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-bold text-[#2457D6] shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Large Readable Numerical Answer or Consistent Placeholder State */}
      <div className="pl-0 sm:pl-12">
        {hasValidResult && resultCard ? (
          <>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15803D] tracking-tight tabular-nums break-words">
              {resultCard.mainValue}
            </div>
            {resultCard.secondaryNote && (
              <p className="text-xs sm:text-sm font-semibold text-[#16856B] mt-1.5">
                {resultCard.secondaryNote}
              </p>
            )}
          </>
        ) : (
          <>
            <div
              aria-hidden="true"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#94A3B8] tracking-tight tabular-nums select-none"
            >
              —
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1.5">
              Live calculation output will appear here automatically once valid inputs are provided.
            </p>
          </>
        )}
      </div>

      {/* Complete Equation Sub-Card */}
      <div
        className={`rounded-xl p-4 space-y-1 border ${
          hasValidResult
            ? 'bg-white/90 border-[#D1FAE5]'
            : 'bg-white border-[#E2E8F0]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-bold text-[#152238]">
            {hasValidResult
              ? 'Formula & Live Calculation:'
              : 'Active Calculation Formula:'}
          </div>
          {isFinanceCalculator && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EEF3FF] text-[#2457D6] text-[11px] font-bold font-mono">
              <Coins className="w-3 h-3" />
              {currency} ({globalCurrencySymbol}) ·{' '}
              {applyExchangeRate
                ? `1 USD = ${globalCurrencySymbol}${formatExchangeRate(currency, rates[currency] ?? 1.0)}`
                : '1:1 Nominal'}
            </span>
          )}
        </div>
        <div className="text-sm sm:text-base font-extrabold text-[#152238] tracking-wide tabular-nums">
          {hasValidResult && resultCard
            ? resultCard.equation
            : formulaCard.formulaText}
        </div>
      </div>
    </section>
  );

  const defaultRightColumnSupplement = (
    <section
      aria-label="Quick formula and verification summary"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs min-h-[192px] flex-1 flex flex-col gap-3.5"
    >
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0">
              <Sigma className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[#152238]">
              Quick Formula &amp; Verification Check
            </h3>
          </div>
          <a
            href="#formula"
            className="text-xs font-bold text-[#2457D6] hover:underline whitespace-nowrap"
          >
            Full Example ↓
          </a>
        </div>

        <div className="rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] px-3.5 py-2.5 text-xs sm:text-sm font-extrabold text-[#2457D6] tabular-nums">
          {formulaCard.formulaText}
        </div>

        {formulaCard.exampleSteps.length > 0 && (
          <div className="space-y-1.5 text-xs text-[#475569]">
            <div className="font-bold text-[#152238]">
              {formulaCard.exampleTitle}
            </div>
            <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2.5 font-mono font-semibold text-[#152238] tabular-nums space-y-1">
              {formulaCard.exampleSteps.slice(0, 3).map((stepLine, idx) => (
                <div key={idx}>{stepLine}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[#475569] font-medium">
          Need benchmark comparisons or practitioner notes?
        </span>
        <div className="flex items-center gap-3 font-bold text-[#2457D6]">
          <a href="#reference-table" className="hover:underline">
            Benchmarks ↓
          </a>
          <a href="#field-notes" className="hover:underline">
            Field Notes ↓
          </a>
        </div>
      </div>
    </section>
  );

  const defaultLeftColumnSupplement = (
    <section
      aria-label="Quick input tips and practitioner guidance"
      className="hidden lg:flex bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs flex-1 flex-col gap-3.5"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#16856B] flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[#152238]">
              Input Checklist &amp; Practitioner Note
            </h3>
          </div>
          <a
            href="#how-it-works"
            className="text-xs font-bold text-[#2457D6] hover:underline whitespace-nowrap"
          >
            Full Guide ↓
          </a>
        </div>

        <ul className="space-y-2 text-xs text-[#475569]">
          {howToUseSteps.slice(0, 3).map((stepItem, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 px-3 py-2"
            >
              <span className="w-5 h-5 rounded-full bg-[#DCE8FF] text-[#2457D6] text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="font-medium text-[#152238] leading-snug">
                {stepItem}
              </span>
            </li>
          ))}
        </ul>

        <div className="rounded-xl bg-[#ECFDF5]/60 border border-[#A7F3D0] p-3.5 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-[#065F46]">
            <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              Practitioner Tip: {editorialProfile.fieldNote.proTipTitle || title}
            </span>
          </div>
          <p className="text-[#064E3B] leading-relaxed">
            {editorialProfile.fieldNote.proTipText || understandingResult.description}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[#475569] font-medium">
          Step-by-step walkthrough &amp; common questions:
        </span>
        <div className="flex items-center gap-3 font-bold text-[#2457D6]">
          <a href="#how-it-works" className="hover:underline">
            How It Works ↓
          </a>
          <a href="#faq" className="hover:underline">
            FAQs ↓
          </a>
        </div>
      </div>
    </section>
  );

  // Modular Section Blocks for Polymorphic DOM Ordering across pages
  const formulaAndExampleBlock = (
    <section
      key="formula"
      id="formula"
      className="scroll-mt-24 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x md:divide-[#E2E8F0]"
    >
      {/* Left: Formula */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0">
            <Sigma className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#152238]">
              {editorialProfile.headings.formulaSectionH2}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              {formulaCard.introText}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#EBF2FF] border border-[#BFDBFE] px-4 py-3.5 text-sm sm:text-base font-extrabold text-[#2457D6] tracking-tight">
          {formulaCard.formulaText}
        </div>
      </div>

      {/* Right: Worked Example */}
      <div className="md:pl-6 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFF4E5] text-[#D97706] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#152238]">
              {editorialProfile.headings.exampleSectionH2}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
              {formulaCard.exampleTitle}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 space-y-1 text-xs sm:text-sm font-bold text-[#152238] tabular-nums">
          {formulaCard.exampleSteps.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    </section>
  );

  const howItWorksAndStepsBlock = (
    <div
      key="how-it-works"
      id="how-it-works"
      className="scroll-mt-24 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Left: How to use this calculator */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-[#2457D6] shrink-0" />
          <h2 className="text-base sm:text-lg font-extrabold text-[#152238]">
            {editorialProfile.headings.howToUseH2}
          </h2>
        </div>

        <ol className="space-y-3 pt-1">
          {howToUseSteps.map((stepText, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#DCE8FF] text-[#2457D6] text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-sm font-medium text-[#152238] leading-relaxed">
                {stepText}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Right: How the calculation works */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-[#2457D6] shrink-0" />
          <h2 className="text-base sm:text-lg font-extrabold text-[#152238]">
            {editorialProfile.headings.howItWorksH2}
          </h2>
        </div>

        <p className="text-sm text-[#475569] leading-relaxed">
          {editorialProfile.humanHowItWorksParagraph || howItWorks.paragraph}
        </p>

        <div className="rounded-xl bg-[#EBF2FF] border border-[#BFDBFE] px-4 py-3 text-sm font-extrabold text-[#2457D6]">
          {howItWorks.formulaBox}
        </div>

        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
          {editorialProfile.humanClosingNote || howItWorks.closingNote}
        </p>
      </section>
    </div>
  );

  const practitionerFieldNoteBlock = (
    <section
      key="field-notes"
      id="field-notes"
      className="scroll-mt-24 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-5"
    >
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#2457D6]">
          <Compass className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{editorialProfile.fieldNote.kicker}</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-[#152238] leading-snug">
          {editorialProfile.fieldNote.heading}
        </h2>
        <p className="text-sm text-[#475569] leading-relaxed">
          {editorialProfile.fieldNote.body}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#B45309]">
            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Common Pitfall: {editorialProfile.fieldNote.commonMistakeTitle}</span>
          </div>
          <p className="text-xs sm:text-sm text-[#78350F] leading-relaxed">
            {editorialProfile.fieldNote.commonMistakeText}
          </p>
        </div>

        <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#065F46]">
            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Practitioner Tip: {editorialProfile.fieldNote.proTipTitle}</span>
          </div>
          <p className="text-xs sm:text-sm text-[#064E3B] leading-relaxed">
            {editorialProfile.fieldNote.proTipText}
          </p>
        </div>
      </div>
    </section>
  );

  const understandingResultBlock = (
    <section
      key="understanding"
      id="understanding-result"
      className="scroll-mt-24 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#FFF4E5] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-[#152238]">
            {editorialProfile.headings.understandingResultH2}
          </h2>
          <div className="text-sm text-[#475569] leading-relaxed">
            {understandingResult.paragraph}
          </div>
          {editorialProfile.humanResultContext && (
            <p className="text-xs sm:text-sm font-medium text-[#152238] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5">
              {editorialProfile.humanResultContext}
            </p>
          )}
        </div>
      </div>
    </section>
  );

  const benchmarkTableSection = (
    <section
      key="reference-table"
      id="reference-table"
      aria-labelledby="quick-reference-heading"
      className="scroll-mt-24 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center shrink-0">
            <Table className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="quick-reference-heading"
              className="text-lg font-extrabold text-[#152238]"
            >
              {activeBenchmarkTable.heading}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              {activeBenchmarkTable.subheading}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold text-[#475569]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" aria-hidden="true" />
          Verified Domain Benchmarks
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#152238] font-extrabold">
              <th scope="col" className="py-3 px-4">
                {activeBenchmarkTable.columns[0]}
              </th>
              <th scope="col" className="py-3 px-4">
                {activeBenchmarkTable.columns[1]}
              </th>
              <th scope="col" className="py-3 px-4">
                {activeBenchmarkTable.columns[2]}
              </th>
              <th scope="col" className="py-3 px-4">
                {activeBenchmarkTable.columns[3]}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {activeBenchmarkTable.rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="py-3 px-4 font-bold text-[#152238] tabular-nums">
                  {row.col1}
                </td>
                <td className="py-3 px-4 text-[#475569] font-semibold tabular-nums">
                  {row.col2}
                </td>
                <td className="py-3 px-4 font-mono font-extrabold text-[#2457D6] tabular-nums">
                  {row.col3}
                </td>
                <td className="py-3 px-4 text-[#475569] text-xs sm:text-sm tabular-nums">
                  {row.col4}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  // Determine the 8-column main stack order based on sectionOrderVariant (0, 1, 2, 3)
  // so different pages have genuinely distinct article structures
  const orderedMainBlocks = (() => {
    switch (editorialProfile.sectionOrderVariant) {
      case 1:
        // Practitioner Field Note & Worked Logic lead before formal equations
        return [
          practitionerFieldNoteBlock,
          howItWorksAndStepsBlock,
          formulaAndExampleBlock,
          understandingResultBlock,
        ];
      case 2:
        // Step-by-step & How It Works lead, followed by Formula, then Field Notes
        return [
          howItWorksAndStepsBlock,
          formulaAndExampleBlock,
          practitionerFieldNoteBlock,
          understandingResultBlock,
        ];
      case 3:
        // Practical Result Interpretation & Field Note lead, followed by Formula & Steps
        return [
          understandingResultBlock,
          practitionerFieldNoteBlock,
          formulaAndExampleBlock,
          howItWorksAndStepsBlock,
        ];
      case 0:
      default:
        // Classic Proof Order: Formula & Example -> How It Works -> Field Note -> Result Context
        return [
          formulaAndExampleBlock,
          howItWorksAndStepsBlock,
          practitionerFieldNoteBlock,
          understandingResultBlock,
        ];
    }
  })();

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238] relative overflow-hidden">
      {isOutsideFinanceLayout && <GlobalFinanceCurrencyBar />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      {/* Subtle soft background radial accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[340px] bg-gradient-to-b from-[#EDF3FC] via-[#F3F7FC] to-transparent"
      />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-14 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2457D6]">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  <li>
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={isLast ? 'page' : undefined}
                        className={isLast ? 'text-[#2457D6] font-bold' : ''}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                  {!isLast && (
                    <li aria-hidden="true" className="text-[#94A3B8]">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ol>
        </nav>

        {/* Hero Header Band */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-1">
          <div className="flex items-start gap-4 sm:gap-5 max-w-3xl">
            {/* Rounded Square Symbol Badge */}
            <div
              aria-hidden="true"
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${heroBadgeBg} ${heroBadgeColor} border border-white shadow-xs flex items-center justify-center shrink-0 text-2xl sm:text-3xl font-extrabold select-none`}
            >
              {displayHeroSymbol}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight">
                {renderHighlightedTitle()}
              </h1>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right 3D-Styled Calculator & Symbol Illustration */}
          <div
            aria-hidden="true"
            className="hidden md:flex items-center justify-center relative w-[250px] h-[126px] shrink-0 select-none"
          >
            <div className="absolute inset-x-2 inset-y-2 rounded-[36px] bg-gradient-to-br from-[#DCE8FF] via-[#E8F1FF] to-[#F0F6FF] border border-white/80 shadow-inner" />

            <div className="relative z-10 -mr-3 -mt-2 w-14 h-14 rounded-2xl bg-white shadow-md border border-[#DCE8FF] p-2.5 flex items-end justify-center gap-1.5 -rotate-6">
              <span className="w-2 h-4 rounded-full bg-[#93C5FD]" />
              <span className="w-2 h-6 rounded-full bg-[#3B82F6]" />
              <span className="w-2 h-8 rounded-full bg-[#2457D6]" />
            </div>

            <div className="relative z-20 w-20 h-24 rounded-2xl bg-gradient-to-b from-[#3B73F5] to-[#1D4ED8] p-2.5 shadow-lg border border-white/30 -rotate-6 flex flex-col justify-between">
              <div className="w-full h-5 rounded-md bg-[#EBF2FF] flex items-center justify-end px-1.5">
                <span className="w-6 h-1.5 rounded-full bg-[#93C5FD]" />
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <span className="h-2.5 rounded-xs bg-white/90" />
                <span className="h-2.5 rounded-xs bg-white/90" />
                <span className="h-2.5 rounded-xs bg-[#93C5FD]" />
                <span className="h-2.5 rounded-xs bg-white/90" />
                <span className="h-2.5 rounded-xs bg-white/90" />
                <span className="h-2.5 rounded-xs bg-[#93C5FD]" />
                <span className="h-2.5 rounded-xs bg-white/90" />
                <span className="h-2.5 rounded-xs bg-white/90" />
                <span className="h-2.5 rounded-xs bg-[#34D399]" />
              </div>
            </div>

            <div className="relative z-30 -ml-2 -mt-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#E11D48] text-white shadow-md border border-white/40 rotate-6 flex items-center justify-center font-extrabold text-xl">
              {displayHeroSymbol}
            </div>
          </div>
        </header>

        {/* On-Page Quick-Jump Table of Contents Bar + Shareable Deep-Link Action */}
        <div className="rounded-xl bg-white border border-[#E2E8F0] px-4 py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="On-page section navigation"
            className="flex flex-wrap items-center gap-2 text-xs"
          >
            <span className="font-extrabold text-[#152238] flex items-center gap-1 mr-1">
              <Hash className="w-3.5 h-3.5 text-[#2457D6]" aria-hidden="true" />
              Jump to:
            </span>
            <a
              href="#workbench"
              className="px-2.5 py-1 rounded-lg bg-[#EEF3FF] text-[#2457D6] font-bold hover:bg-[#DCE7FF] transition-colors"
            >
              Calculator
            </a>
            <a
              href="#formula"
              className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#EEF3FF] text-[#152238] hover:text-[#2457D6] border border-[#E2E8F0] font-semibold transition-colors"
            >
              Formula &amp; Example
            </a>
            <a
              href="#field-notes"
              className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#EEF3FF] text-[#152238] hover:text-[#2457D6] border border-[#E2E8F0] font-semibold transition-colors"
            >
              Field Notes &amp; Tips
            </a>
            <a
              href="#reference-table"
              className="px-2.5 py-1 rounded-lg bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] font-bold transition-colors"
            >
              Reference Benchmarks
            </a>
            <a
              href="#faq"
              className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#EEF3FF] text-[#152238] hover:text-[#2457D6] border border-[#E2E8F0] font-semibold transition-colors"
            >
              FAQs
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-compact="true"
              onClick={handleCopyShareLink}
              className="compact-control inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#EEF3FF] text-[#152238] hover:text-[#2457D6] border border-[#CBD5E1] text-xs font-bold transition-colors cursor-pointer"
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#16856B]" aria-hidden="true" />
                  <span className="text-[#16856B]">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#2457D6]" aria-hidden="true" />
                  <span>Share Calculator</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Top 2-Column Live Workbench:
            - Case 1: fullWidthWorkbench (e.g. US Federal Income Tax Calculator & Finance Suite clients with internal 5/7 split)
            - Case 2: Standard 2-column workbench (Inputs on Left 6 cols, Live Result Card + Companion Supplement on Right 6 cols; always rendered with min-height and placeholder state when empty to prevent right-side layout collapse) */}
        <div id="workbench" className="scroll-mt-24">
          {fullWidthWorkbench ? (
            <div className="w-full">{calculatorCard}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:items-stretch">
              <div className="lg:col-span-6 flex flex-col gap-5 min-h-[480px]">
                {calculatorCard}
                {leftColumnSupplement ?? defaultLeftColumnSupplement}
              </div>
              <div className="lg:col-span-6 flex flex-col gap-5 min-h-[480px]">
                {renderedResultCard}
                {rightColumnSupplement ?? defaultRightColumnSupplement}
              </div>
            </div>
          )}
        </div>

        {/* Optional Full-Width Reference Sections Directly Below Workbench */}
        {belowWorkbenchContent && (
          <div className="space-y-6">{belowWorkbenchContent}</div>
        )}

        {/* Variant 1 & 3 place the Domain Benchmark Table directly under the Workbench for immediate comparison */}
        {(editorialProfile.sectionOrderVariant === 1 ||
          editorialProfile.sectionOrderVariant === 3) &&
          benchmarkTableSection}

        {/* Main Content Stack (8 Cols Left) + Sidebar (4 Cols Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            {orderedMainBlocks}
          </div>

          {/* Right Sidebar: Other Calculators + Need a Different Calculator CTA */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Sidebar Card 1: Other [Category] Calculators */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-1">
                <div className="w-7 h-7 rounded-lg bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-[#152238]">
                  {otherCalculatorsTitle}
                </h2>
              </div>

              <ul className="divide-y divide-[#F1F5F9]">
                {otherCalculators.map((item, idx) => (
                  <li key={idx} className="py-3.5 first:pt-1 last:pb-0">
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <SidebarIconBadge variant={item.iconVariant} />
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6] transition-colors truncate">
                            {item.name}
                          </div>
                          <p className="text-xs text-[#64748B] leading-snug line-clamp-2 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#2457D6] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sidebar Card 2: Need a different calculator? */}
            <div className="rounded-2xl bg-gradient-to-br from-[#EEF4FF] via-[#E6F0FF] to-[#DCE8FF] border border-[#BFDBFE] p-6 shadow-2xs space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white text-[#F59E0B] shadow-2xs border border-[#DCE8FF] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6 fill-[#FBBF24] text-[#D97706]" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-extrabold text-[#152238]">
                    Need a different calculator?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Explore all {categoryName.toLowerCase()} calculators and find the right tool for your needs.
                  </p>
                </div>
              </div>

              <Link
                href={categoryHref}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0B5CFF] hover:bg-[#1D46B0] text-white text-sm font-bold shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#152238]"
              >
                <span>View All {categoryName} Calculators</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Variant 0 & 2 place the Domain Benchmark Table below the 8/4 grid */}
        {editorialProfile.sectionOrderVariant !== 1 &&
          editorialProfile.sectionOrderVariant !== 3 &&
          benchmarkTableSection}

        {/* Lower Section Row: Frequently Asked Questions + Related Calculators (Swapped horizontal order on even vs odd variants) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:items-stretch">
          {/* Frequently Asked Questions */}
          <section
            id="faq"
            className={`scroll-mt-24 lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs flex flex-col justify-between gap-4 ${
              editorialProfile.sectionOrderVariant % 2 === 1 ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#2457D6] text-white flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-extrabold text-[#152238]">
                    {editorialProfile.headings.faqSectionH2}
                  </h2>
                </div>

                <Link
                  href={categoryHref}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2457D6] hover:underline"
                >
                  <span>View All {categoryName} Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {enrichedFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-bold text-[#152238] hover:text-[#2457D6] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#475569] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#2457D6]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-[#E2E8F0]/70 bg-white">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
              <span>Every formula is verified against authoritative domain standards.</span>
              <a href="#workbench" className="font-bold text-[#2457D6] hover:underline">
                Back to Calculator ↑
              </a>
            </div>
          </section>

          {/* Related Calculators */}
          <section
            className={`lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs flex flex-col justify-between gap-4 ${
              editorialProfile.sectionOrderVariant % 2 === 1 ? 'lg:order-1' : 'lg:order-2'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-5 h-5 text-[#2457D6] shrink-0" />
                <h2 className="text-lg font-extrabold text-[#152238]">
                  {editorialProfile.headings.relatedSectionH2}
                </h2>
              </div>

              <ul className="divide-y divide-[#F1F5F9]">
                {relatedCalculators.map((item, idx) => (
                  <li key={idx} className="py-3 first:pt-1 last:pb-0">
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <SidebarIconBadge variant={item.iconVariant} />
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6] transition-colors truncate">
                            {item.name}
                          </div>
                          <p className="text-xs text-[#64748B] truncate mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#2457D6] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 flex items-center justify-between gap-3">
              <div className="text-xs text-[#475569]">
                <div className="font-extrabold text-[#152238]">
                  Browse all {categoryName} tools
                </div>
                <div>Compare related formulas and reference tables.</div>
              </div>
              <Link
                href={categoryHref}
                className="px-3.5 py-2 rounded-lg bg-[#EBF2FF] hover:bg-[#DCE8FF] text-[#2457D6] text-xs font-extrabold whitespace-nowrap shrink-0 transition-colors"
              >
                Explore All →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
