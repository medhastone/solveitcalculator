'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  Check,
  ChevronRight,
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
  Table,
  Compass,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import {
  resolveHumanEditorialProfile,
  ensureMinimumSearchFaqs,
} from '@/lib/humanEditorialCatalog';
import { resolveToolTrustMetadata } from '@/lib/trustMetadataCatalog';
import { getCoreCalculatorSeoBySlug } from '@/lib/coreCalculatorSeoContent';
import { getCalculatorInternalLinks } from '@/lib/internalLinkingMap';
import { useCurrency, formatExchangeRate } from '@/lib/currency';
import HighContrastResultCard from '@/components/calculator-page/HighContrastResultCard';

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
  intentBadge?: string;
}

export interface QuickPresetItem {
  label: string;
  onSelect: () => void;
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
  /** Plain 1-2 sentence answer rendered directly under H1 above the workbench */
  quickAnswer?: {
    question?: string;
    answer: string;
    targetAnchor?: string;
    targetLabel?: string;
  };
  /** Worked Example card explicitly badged "Example" separately from user result */
  workedExampleCard?: {
    title: string;
    equation: string;
    steps?: string[];
  };
  /** Matching /guides/... article link */
  matchingGuide?: {
    title: string;
    description: string;
    href: string;
  };
  /** Layout variant: stack live result right below inputs for 375px visibility */
  layoutVariant?: 'default' | 'result-below-inputs';
  /** Skip generic FAQ padding and emit strictly curated visible FAQs */
  useCuratedFaqsOnly?: boolean;
  /** Schema.org WebApplication applicationCategory */
  schemaAppCategory?:
    | 'FinanceApplication'
    | 'HealthApplication'
    | 'EducationalApplication'
    | 'UtilitiesApplication';
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
  /** Optional 1-click scenario presets rendered above the calculator inputs */
  presets?: QuickPresetItem[];
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
  quickAnswer,
  workedExampleCard,
  matchingGuide,
  layoutVariant = 'default',
  useCuratedFaqsOnly = false,
  schemaAppCategory,
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
  const workbenchRef = useRef<HTMLDivElement>(null);

  const setNativeElementValue = useCallback(
    (el: HTMLInputElement | HTMLSelectElement, value: string) => {
      const proto =
        el instanceof HTMLSelectElement
          ? window.HTMLSelectElement.prototype
          : window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
      if (descriptor && descriptor.set) {
        descriptor.set.call(el, value);
      } else {
        el.value = value;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    },
    []
  );

  // Hydrate calculator inputs from URL query parameters on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !workbenchRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (Array.from(params.keys()).length === 0) return;

    const elements = Array.from(
      workbenchRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
        'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), select'
      )
    );

    elements.forEach((el, idx) => {
      const key = el.id || el.name || `in_${idx}`;
      const paramVal = params.get(key);
      if (paramVal !== null && paramVal.trim() !== '') {
        setNativeElementValue(el, paramVal);
      }
    });
  }, [setNativeElementValue]);

  const isFinanceCalculator =
    categoryHref.startsWith('/finance') ||
    categoryName.toLowerCase().includes('finance') ||
    Boolean(pathname?.startsWith('/finance'));

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
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          const ta = document.createElement('textarea');
          ta.value = textToCopy;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
    } else if (typeof document !== 'undefined') {
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyShareLink = () => {
    let shareUrl = `https://solveitcalculator.com${pathname || ''}`;
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (workbenchRef.current) {
        const elements = Array.from(
          workbenchRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
            'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), select'
          )
        );
        elements.forEach((el, idx) => {
          const key = el.id || el.name || `in_${idx}`;
          if (el.value !== undefined && el.value.trim() !== '') {
            url.searchParams.set(key, el.value.trim());
          }
        });
        window.history.replaceState(null, '', url.toString());
      }
      shareUrl = url.toString();
    }
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

  const cleanToolSlug = useMemo(
    () =>
      (pathname || title)
        .split('/')
        .filter(Boolean)
        .pop()
        ?.toLowerCase() || '',
    [pathname, title]
  );

  const hasCoreSeoOverride = Boolean(getCoreCalculatorSeoBySlug(cleanToolSlug));

  const internalLinkEntry = useMemo(
    () => getCalculatorInternalLinks(pathname),
    [pathname]
  );

  const effectiveRelatedCalculators = useMemo<RelatedCalculatorLink[]>(() => {
    if (internalLinkEntry && internalLinkEntry.relatedCalculators.length === 3) {
      const intentTags = [
        'Next Step',
        'Compare Scenario',
        'Companion Formula',
      ];
      return internalLinkEntry.relatedCalculators.map((calc, idx) => {
        const existingMatch = relatedCalculators.find((r) => r.href === calc.path);
        return {
          name: calc.name,
          description: calc.description,
          href: calc.path,
          iconVariant: existingMatch?.iconVariant || 'calculator',
          intentBadge: existingMatch?.intentBadge || intentTags[idx],
        };
      });
    }
    return relatedCalculators.slice(0, 3);
  }, [internalLinkEntry, relatedCalculators]);

  const trustMeta = useMemo(
    () =>
      resolveToolTrustMetadata({
        slug: cleanToolSlug,
        categoryHref,
        categoryName,
      }),
    [cleanToolSlug, categoryHref, categoryName]
  );

  const enrichedFaqs = useMemo(() => {
    if (useCuratedFaqsOnly) {
      return faqs.slice(0, 7);
    }
    return ensureMinimumSearchFaqs(
      faqs,
      {
        slug: cleanToolSlug,
        title: fullTitle,
        categoryName,
        formulaText: formulaCard.formulaText,
        exampleTitle: formulaCard.exampleTitle,
        exampleSteps: formulaCard.exampleSteps,
        fieldNote: editorialProfile.fieldNote,
        benchmarkRows: activeBenchmarkTable.rows,
      },
      5
    );
  }, [
    useCuratedFaqsOnly,
    faqs,
    cleanToolSlug,
    fullTitle,
    categoryName,
    formulaCard,
    editorialProfile.fieldNote,
    activeBenchmarkTable.rows,
  ]);

  const resolvedAppCategory =
    schemaAppCategory ||
    (isFinanceCalculator
      ? 'FinanceApplication'
      : categoryName.toLowerCase().includes('health')
      ? 'HealthApplication'
      : categoryName.toLowerCase().includes('math')
      ? 'EducationalApplication'
      : 'UtilitiesApplication');

  // Automatic Schema.org JSON-LD graph (WebApplication + HowTo + FAQPage + BreadcrumbList)
  const canonicalUrl = `https://solveitcalculator.com${pathname || ''}`;
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: fullTitle,
        description: subtitle,
        url: canonicalUrl,
        applicationCategory: resolvedAppCategory,
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
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

  const isCompactStack = layoutVariant === 'result-below-inputs';

  const renderedResultCard = (
    <HighContrastResultCard
      id="live-result-card"
      hasValidResult={hasValidResult}
      promptSummary={resultCard?.promptSummary}
      promptSuffix={resultCard?.promptSuffix ?? 'is:'}
      mainValue={resultCard?.mainValue}
      equation={resultCard?.equation}
      fallbackFormula={formulaCard.formulaText}
      secondaryNote={resultCard?.secondaryNote}
      placeholderMessage={resultCard?.placeholderMessage}
      onCopyResult={handleCopyResult}
      copiedExternal={copied}
      onShareLink={handleCopyShareLink}
      linkCopiedExternal={linkCopied}
      onPrint={handlePrint}
      showPrint={!isCompactStack}
      currencyBadgeText={
        isFinanceCalculator
          ? `${currency} (${globalCurrencySymbol}) · ${
              applyExchangeRate
                ? `1 USD = ${globalCurrencySymbol}${formatExchangeRate(currency, rates[currency] ?? 1.0)}`
                : '1:1 Nominal'
            }`
          : undefined
      }
    />
  );

  const renderedWorkedExampleCard = workedExampleCard ? (
    <section
      aria-label="Worked calculation example"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-2xs space-y-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[#FFF4E5] border border-[#FDE68A] text-[11px] font-extrabold uppercase tracking-wider text-[#B45309]">
            Example
          </span>
          <h3 className="text-sm font-extrabold text-[#152238]">
            {workedExampleCard.title}
          </h3>
        </div>
        <a
          href="#formula"
          className="min-h-[44px] inline-flex items-center text-xs font-bold text-[#2457D6] hover:underline whitespace-nowrap"
        >
          Formula ↓
        </a>
      </div>
      <div className="rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] px-3.5 py-2.5 text-xs sm:text-sm font-extrabold text-[#152238] tabular-nums">
        {workedExampleCard.equation}
      </div>
      {workedExampleCard.steps && workedExampleCard.steps.length > 0 && (
        <ul className="space-y-1 text-xs text-[#475569] leading-relaxed">
          {workedExampleCard.steps.map((stepLine, idx) => (
            <li key={idx} className="font-medium">
              • {stepLine}
            </li>
          ))}
        </ul>
      )}
    </section>
  ) : null;

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
          Need reference examples or calculation notes?
        </span>
        <div className="flex items-center gap-3 font-bold text-[#2457D6]">
          <a href="#reference-table" className="hover:underline">
            Lookup Table ↓
          </a>
          <a href="#field-notes" className="hover:underline">
            Calculation Notes ↓
          </a>
        </div>
      </div>
    </section>
  );

  const defaultLeftColumnSupplement = (
    <section
      aria-label="Quick input tips and usage guidance"
      className="hidden lg:flex bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs flex-1 flex-col gap-3.5"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#16856B] flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[#152238]">
              Input Checklist &amp; Usage Guide
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
      </div>

      <div className="mt-auto pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[#475569] font-medium">
          Step-by-step walkthrough &amp; common questions:
        </span>
        <div className="flex items-center gap-3 font-bold text-[#2457D6]">
          <a href="#how-it-works" className="min-h-[44px] inline-flex items-center hover:underline">
            How It Works ↓
          </a>
          <a href="#faq" className="min-h-[44px] inline-flex items-center hover:underline">
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
          <span>
            {editorialProfile.fieldNote.kicker
              .replace(/Practitioner Field Note/gi, 'Calculation Note')
              .replace(/Field Note/gi, 'Calculation Note')}
          </span>
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
            <span>Calculation Note: {editorialProfile.fieldNote.proTipTitle}</span>
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

        <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
          {trustMeta && trustMeta.sources.length > 0 ? (
            <a
              href={trustMeta.sources[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] font-bold text-[#0A58ED] hover:underline"
            >
              <span>
                Source: {trustMeta.sources[0].label.split('—')[0].trim()} ·{' '}
                {trustMeta.dataTaxYear || `Updated ${trustMeta.lastUpdated}`}
              </span>
              <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] font-bold text-[#475569]">
              Reference Lookup Table · Updated November 2026
            </span>
          )}
        </div>
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
    <main
      id="main-content"
      className="min-h-screen bg-[#F5F7FA] text-[#152238] relative overflow-hidden"
    >
      {!hasCoreSeoOverride && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      )}

      {/* Subtle soft background radial accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-[340px] bg-gradient-to-b from-[#EDF3FC] via-[#F3F7FC] to-transparent"
      />

      <div
        className={`relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 ${
          hasCoreSeoOverride ? 'pb-6' : 'pb-14'
        } space-y-3 sm:space-y-4`}
      >
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
                        className="inline-flex items-center min-h-[44px] sm:min-h-0 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
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

        {/* Compact Hero Header Band */}
        <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4 max-w-4xl">
            <div
              aria-hidden="true"
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${heroBadgeBg} ${heroBadgeColor} border border-white shadow-xs flex items-center justify-center shrink-0 text-lg sm:text-xl font-extrabold select-none mt-0.5`}
            >
              {displayHeroSymbol}
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                {renderHighlightedTitle()}
              </h1>
              {!quickAnswer && (
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-3xl">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Plain 1-2 Sentence Quick Answer Directly Under H1 */}
        {quickAnswer && (
          <div
            role="region"
            aria-label="Direct answer summary"
            className="bg-white rounded-xl border border-[#CBD5E1] px-4 py-2.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <p className="text-xs sm:text-sm text-[#152238] leading-snug font-medium">
              {quickAnswer.answer}
            </p>
            {quickAnswer.targetAnchor && quickAnswer.targetLabel && (
              <a
                href={quickAnswer.targetAnchor}
                className="min-h-[44px] sm:min-h-0 inline-flex items-center text-xs font-bold text-[#2457D6] hover:underline whitespace-nowrap shrink-0"
              >
                {quickAnswer.targetLabel}
              </a>
            )}
          </div>
        )}

        {/* Top Workbench: High-contrast result card positioned immediately below inputs on all viewports */}
        <div id="workbench" ref={workbenchRef} className="scroll-mt-24">
          {fullWidthWorkbench ? (
            <div className="w-full">{calculatorCard}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-7 flex flex-col gap-4">
                {calculatorCard}
                {renderedResultCard}
              </div>
              <div className="lg:col-span-5 flex flex-col gap-4">
                {renderedWorkedExampleCard}
                {rightColumnSupplement ?? defaultRightColumnSupplement}
                {leftColumnSupplement ?? (!isCompactStack ? defaultLeftColumnSupplement : null)}
              </div>
            </div>
          )}
        </div>



        {/* Optional Full-Width Reference Sections Directly Below Workbench */}
        {belowWorkbenchContent && (
          <div className="space-y-6">{belowWorkbenchContent}</div>
        )}

        {/* Related Formula Guide Callout Box (1–2 Most Relevant Guides) */}
        {internalLinkEntry && internalLinkEntry.guides.length > 0 && (
          <aside
            aria-label="Related formula guide"
            className="rounded-2xl bg-gradient-to-r from-[#EEF4FF] via-[#F4F8FF] to-white border border-[#BFDBFE] p-4 sm:p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  aria-hidden="true"
                  className="w-6 h-6 rounded-lg bg-[#2457D6] text-white flex items-center justify-center shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#2457D6]">
                  {internalLinkEntry.guides.length > 1
                    ? 'Related Guides'
                    : 'Related Guide'}
                </h2>
              </div>
              <Link
                href="/guides"
                className="text-xs font-bold text-[#2457D6] hover:underline whitespace-nowrap"
              >
                All Formula Guides →
              </Link>
            </div>

            <div
              className={`grid grid-cols-1 ${
                internalLinkEntry.guides.length > 1 ? 'md:grid-cols-2' : ''
              } gap-3`}
            >
              {internalLinkEntry.guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={guide.href}
                  className="group flex items-center justify-between gap-3 rounded-xl bg-white hover:bg-[#F8FBFF] border border-[#CFE0FC] hover:border-[#2457D6] px-4 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6] transition-colors leading-snug">
                      {guide.title}
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed mt-0.5 line-clamp-2">
                      {guide.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-[#2457D6] shrink-0 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </aside>
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
                {otherCalculators.map((item, idx) => {
                  const defaultIntentLabels = [
                    'Next Step',
                    'Compare Scenario',
                    'Formula Companion',
                    'Related Check',
                    'Quick Lookup',
                  ];
                  const badgeText =
                    item.intentBadge ||
                    defaultIntentLabels[idx % defaultIntentLabels.length];
                  return (
                    <li key={idx} className="py-3.5 first:pt-1 last:pb-0">
                      <Link
                        href={item.href}
                        className="group flex items-center justify-between gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <SidebarIconBadge variant={item.iconVariant} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6] transition-colors truncate">
                                {item.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[10px] font-bold text-[#475569]">
                                {badgeText}
                              </span>
                            </div>
                            <p className="text-xs text-[#64748B] leading-snug line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#2457D6] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </li>
                  );
                })}
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
          {/* Frequently Asked Questions (suppressed on flagship pages served by SSR CoreCalculatorSeoSection) */}
          {!hasCoreSeoOverride && (
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

                <dl className="space-y-3">
                  {enrichedFaqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-1.5"
                    >
                      <dt className="text-sm font-extrabold text-[#152238] leading-snug">
                        {faq.question}
                      </dt>
                      <dd className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                        {faq.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
                <span>
                  Formulas and constants reference published standards (see{' '}
                  <Link href="/calculation-methodology" className="font-bold text-[#0A58ED] hover:underline">
                    Methodology
                  </Link>
                  ).
                </span>
                <div className="flex items-center gap-3 font-bold">
                  <Link href="/contact" className="text-[#0A58ED] hover:underline">
                    Contact
                  </Link>
                  <span className="text-[#CBD5E1]">•</span>
                  <a href="#workbench" className="min-h-[44px] inline-flex items-center text-[#2457D6] hover:underline">
                    Back to Calculator ↑
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Related Calculators & Matching Guide Grouped by Search Intent */}
          <section
            id="related-tools"
            className={`${
              hasCoreSeoOverride ? 'lg:col-span-12' : 'lg:col-span-5'
            } bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs flex flex-col justify-between gap-4 ${
              !hasCoreSeoOverride && editorialProfile.sectionOrderVariant % 2 === 1
                ? 'lg:order-1'
                : 'lg:order-2'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-5 h-5 text-[#2457D6] shrink-0" />
                <h2 className="text-lg font-extrabold text-[#152238]">
                  {editorialProfile.headings.relatedSectionH2}
                </h2>
              </div>

              <ul
                className={
                  hasCoreSeoOverride
                    ? 'grid grid-cols-1 md:grid-cols-3 gap-4'
                    : 'divide-y divide-[#F1F5F9]'
                }
              >
                {effectiveRelatedCalculators.map((item, idx) => {
                  const intentTags = [
                    'Next Step',
                    'Compare Scenario',
                    'Companion Formula',
                  ];
                  const badgeText =
                    item.intentBadge || intentTags[idx % intentTags.length];
                  return (
                    <li
                      key={item.href}
                      className={
                        hasCoreSeoOverride
                          ? 'rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 hover:border-[#BFDBFE] transition-colors'
                          : 'py-1.5 first:pt-0 last:pb-0'
                      }
                    >
                      <Link
                        href={item.href}
                        className="min-h-[44px] py-1.5 group flex items-center justify-between gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <SidebarIconBadge variant={item.iconVariant} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6] transition-colors truncate">
                                {item.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-[#EEF3FF] text-[10px] font-bold text-[#2457D6]">
                                {badgeText}
                              </span>
                            </div>
                            <p className="text-xs text-[#64748B] line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#2457D6] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {matchingGuide && (
                <Link
                  href={matchingGuide.href}
                  className="min-h-[44px] flex items-center justify-between gap-3 rounded-xl bg-[#EEF3FF] hover:bg-[#DCE7FF] border border-[#BFDBFE] p-3.5 transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <BookOpen className="w-4 h-4 text-[#2457D6] shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2457D6]">
                        Matching Guide
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-[#152238] leading-snug">
                        {matchingGuide.title}
                      </div>
                      <p className="text-xs text-[#475569] line-clamp-2 mt-0.5">
                        {matchingGuide.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#2457D6] shrink-0" aria-hidden="true" />
                </Link>
              )}
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
                className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-lg bg-[#EBF2FF] hover:bg-[#DCE8FF] text-[#2457D6] text-xs font-extrabold whitespace-nowrap shrink-0 transition-colors"
              >
                Explore All →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
