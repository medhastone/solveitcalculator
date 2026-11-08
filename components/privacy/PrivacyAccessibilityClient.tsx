'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronDown,
  Info,
  Sun,
  Contrast,
  Moon,
  Link2,
  Lightbulb,
  CheckCircle2,
  MessageCircleMore,
  ArrowRight,
  FileText,
  LayoutGrid,
  UserCheck,
} from 'lucide-react';

type TextSizeOption = 'small' | 'medium' | 'large';
type DisplayModeOption = 'default' | 'high-contrast' | 'dark';

interface A11yPreferences {
  textSize: TextSizeOption;
  displayMode: DisplayModeOption;
  reduceMotion: boolean;
}

const STORAGE_KEY = 'solveit_a11y_prefs';

const TOC_ITEMS = [
  { id: 'information-we-collect', num: '1.', label: 'Information we collect' },
  {
    id: 'how-calculator-inputs-are-processed',
    num: '2.',
    label: 'How calculator inputs are processed',
  },
  { id: 'cookies-and-analytics', num: '3.', label: 'Cookies and analytics' },
  { id: 'advertising-technologies', num: '4.', label: 'Advertising technologies' },
  { id: 'your-choices', num: '5.', label: 'Your choices' },
  {
    id: 'data-security-and-retention',
    num: '6.',
    label: 'Data security and retention',
  },
  { id: 'accessibility-commitment', num: '7.', label: 'Accessibility commitment' },
  { id: 'how-to-contact-us', num: '8.', label: 'How to contact us' },
  {
    id: 'technical-details',
    num: '9.',
    label: 'Technical details (optional)',
  },
];

export default function PrivacyAccessibilityClient() {
  const [activeSection, setActiveSection] = useState<string>(
    'information-we-collect'
  );
  const [technicalOpen, setTechnicalOpen] = useState<boolean>(false);

  const [prefs, setPrefs] = useState<A11yPreferences>({
    textSize: 'medium',
    displayMode: 'default',
    reduceMotion: false,
  });

  // Load saved accessibility preferences from localStorage on mount and listen for header theme toggles
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<A11yPreferences>;
          setPrefs({
            textSize:
              parsed.textSize === 'small' ||
              parsed.textSize === 'medium' ||
              parsed.textSize === 'large'
                ? parsed.textSize
                : 'medium',
            displayMode:
              parsed.displayMode === 'default' ||
              parsed.displayMode === 'high-contrast' ||
              parsed.displayMode === 'dark'
                ? parsed.displayMode
                : 'default',
            reduceMotion: Boolean(parsed.reduceMotion),
          });
        }
      } catch {
        // Ignore storage access issues in restricted browsers
      }
    };

    loadFromStorage();

    const handleHeaderThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isDark?: boolean }>;
      if (
        customEvent.detail &&
        typeof customEvent.detail.isDark === 'boolean'
      ) {
        const nextMode: DisplayModeOption = customEvent.detail.isDark
          ? 'dark'
          : 'default';
        setPrefs((prev) =>
          prev.displayMode === nextMode
            ? prev
            : { ...prev, displayMode: nextMode }
        );
      }
    };

    window.addEventListener('solveit-theme-change', handleHeaderThemeChange);
    return () =>
      window.removeEventListener(
        'solveit-theme-change',
        handleHeaderThemeChange
      );
  }, []);

  // Apply preferences to document root, persist to localStorage, and notify header
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage write errors
    }

    const root = document.documentElement;
    root.setAttribute('data-a11y-text-size', prefs.textSize);
    root.setAttribute('data-a11y-display-mode', prefs.displayMode);
    root.setAttribute(
      'data-a11y-reduce-motion',
      prefs.reduceMotion ? 'true' : 'false'
    );

    const isDark = prefs.displayMode === 'dark';
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');

    window.dispatchEvent(
      new CustomEvent('solveit-theme-change', {
        detail: { isDark },
      })
    );
  }, [prefs]);

  // Update active TOC item on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = TOC_ITEMS.length - 1; i >= 0; i--) {
        const item = TOC_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    setActiveSection(id);
    if (id === 'technical-details') {
      setTechnicalOpen(true);
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({
        behavior: prefs.reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  // Compute dynamic typography & contrast classes for the content container
  const bodySizeClass =
    prefs.textSize === 'small'
      ? 'text-[13.5px] leading-[1.6]'
      : prefs.textSize === 'large'
      ? 'text-[17px] leading-[1.75]'
      : 'text-[15px] leading-[1.65]';

  const headingSizeClass =
    prefs.textSize === 'small'
      ? 'text-[18px]'
      : prefs.textSize === 'large'
      ? 'text-[23px]'
      : 'text-[20px]';

  const isHighContrast = prefs.displayMode === 'high-contrast';
  const isDarkMode = prefs.displayMode === 'dark';

  const pageBgClass = isDarkMode
    ? 'bg-[#0B1324] text-[#F8FAFC]'
    : isHighContrast
    ? 'bg-white text-black'
    : 'bg-[#F6F8FC] text-[#0F1B33]';

  const cardBgClass = isDarkMode
    ? 'bg-[#131F36] border-[#263859] text-[#F1F5F9]'
    : isHighContrast
    ? 'bg-white border-2 border-black text-black'
    : 'bg-white border border-[#E3EAF4] text-[#0F1B33]';

  const mutedTextClass = isDarkMode
    ? 'text-[#CBD5E1]'
    : isHighContrast
    ? 'text-black font-medium'
    : 'text-[#3B4A64]';

  const transitionClass = prefs.reduceMotion ? '' : 'transition-all duration-150';

  return (
    <div className={`min-h-screen ${pageBgClass} ${transitionClass}`}>
      {/* Hero Section */}
      <section
        className={
          isDarkMode
            ? 'border-b border-[#1E2E4D] bg-gradient-to-b from-[#111E38] via-[#0F1A30] to-[#0B1324] pt-4 pb-7'
            : isHighContrast
            ? 'border-b-2 border-black bg-[#F0F4FF] pt-4 pb-7'
            : 'border-b border-[#E3EAF4] bg-gradient-to-b from-[#ECF3FF] via-[#F2F6FF] to-[#F6F8FC] pt-4 pb-7'
        }
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs sm:text-[13px] font-medium"
          >
            <Link
              href="/"
              className="text-[#0A58ED] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] rounded-xs"
            >
              Home
            </Link>
            <ChevronRight
              className="w-3.5 h-3.5 text-[#7A8BA6]"
              aria-hidden="true"
            />
            <span
              className="text-[#0A58ED] font-semibold"
              aria-current="page"
            >
              Privacy and Accessibility
            </span>
          </nav>

          {/* Hero Main Flex */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Shield Lock Icon + H1 + Intro Paragraph */}
            <div className="flex items-start gap-4 sm:gap-5 max-w-[820px]">
              {/* Left Rounded Blue Shield-Lock Emblem */}
              <div
                className="w-16 h-16 sm:w-[76px] sm:h-[76px] rounded-2xl bg-[#DCE8FF] flex items-center justify-center shrink-0 mt-1 shadow-2xs"
                aria-hidden="true"
              >
                <div className="w-11 h-12 sm:w-12 sm:h-13 rounded-b-2xl rounded-t-md bg-[#0A58ED] flex items-center justify-center shadow-xs">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-sm bg-white flex flex-col items-center justify-center relative mt-1">
                    <div className="w-3 h-2.5 border-2 border-white rounded-t-full -mt-3.5 mb-0.5" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0A58ED]" />
                    <div className="w-0.5 h-1.5 bg-[#0A58ED]" />
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-3xl sm:text-[42px] font-extrabold tracking-tight leading-[1.15]">
                  <span className={isDarkMode ? 'text-white' : 'text-[#0B1528]'}>
                    Privacy and{' '}
                  </span>
                  <span className="text-[#0A58ED]">Accessibility</span>
                </h1>
                <p
                  className={`mt-2.5 text-sm sm:text-[16.5px] leading-relaxed max-w-[710px] ${mutedTextClass}`}
                >
                  We value your trust. This page explains what information we
                  collect, how it is used, your choices, and our commitment to
                  making SolveItCalculator accessible to as many people as
                  possible.
                </p>
              </div>
            </div>

            {/* Right: Document + Leaves + Padlock Illustration matching screenshot */}
            <div
              className="hidden lg:flex items-center justify-end shrink-0 pr-2"
              aria-hidden="true"
            >
              <div className="relative w-[220px] h-[136px] flex items-center justify-center">
                {/* Soft circular backdrop */}
                <div className="absolute inset-x-3 inset-y-1 rounded-full bg-[#DCE9FF]/70" />

                {/* Left green leaf */}
                <div className="absolute left-3 bottom-3 w-11 h-14 rounded-tl-3xl rounded-br-3xl bg-gradient-to-br from-[#34B37E] to-[#128758] -rotate-25 shadow-2xs" />

                {/* Right green leaf */}
                <div className="absolute right-4 top-5 w-10 h-13 rounded-tr-3xl rounded-bl-3xl bg-gradient-to-bl from-[#2EA875] to-[#0E744B] rotate-20 shadow-2xs" />

                {/* Center document sheet */}
                <div className="relative z-10 w-[106px] h-[116px] rounded-2xl bg-[#76A9FA] p-2 shadow-sm">
                  <div className="w-full h-full rounded-xl bg-white p-3 flex flex-col gap-2">
                    <div className="w-12 h-2 rounded-full bg-[#B3CFFA]" />
                    <div className="w-full h-2 rounded-full bg-[#CEE0FC]" />
                    <div className="w-4/5 h-2 rounded-full bg-[#CEE0FC]" />
                    <div className="w-full h-2 rounded-full bg-[#CEE0FC]" />
                    <div className="w-2/3 h-2 rounded-full bg-[#CEE0FC]" />
                    <div className="w-1/2 h-2 rounded-full bg-[#CEE0FC]" />
                  </div>
                </div>

                {/* Bottom-right blue lock circle badge */}
                <div className="absolute right-5 bottom-1.5 z-20 w-14 h-14 rounded-full bg-[#0A58ED] border-4 border-[#EAF2FF] flex items-center justify-center shadow-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-3.5 h-2.5 border-2 border-white rounded-t-full -mb-0.5" />
                    <div className="w-5 h-4 rounded-xs bg-white flex flex-col items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#0A58ED]" />
                      <div className="w-0.5 h-1 bg-[#0A58ED]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main 3-Column Content Area */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Sticky Table of Contents (3 cols) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-20">
            <div className={`rounded-2xl p-4 sm:p-5 shadow-2xs ${cardBgClass}`}>
              <div className="flex items-center gap-2.5 pb-3.5 mb-3 border-b border-[#E3EAF4]">
                <span className="w-7 h-7 rounded-lg bg-[#EBF3FF] text-[#0A58ED] flex items-center justify-center shrink-0">
                  <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                </span>
                <h2 className="text-[15px] font-extrabold tracking-tight">
                  Table of contents
                </h2>
              </div>

              <nav aria-label="Table of contents">
                <ol className="space-y-1">
                  {TOC_ITEMS.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          onClick={(e) => handleTocClick(e, item.id)}
                          className={`group flex items-start gap-2.5 px-3 py-2 rounded-lg text-[13.5px] leading-snug ${transitionClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] ${
                            isActive
                              ? 'bg-[#EDF4FF] text-[#0A58ED] font-bold border-l-[3px] border-[#0A58ED]'
                              : `${mutedTextClass} hover:bg-[#F3F7FD] hover:text-[#0A58ED] font-medium`
                          }`}
                        >
                          <span
                            className={`shrink-0 ${
                              isActive
                                ? 'text-[#0A58ED] font-bold'
                                : 'text-[#64748B]'
                            }`}
                          >
                            {item.num}
                          </span>
                          <span>{item.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          </aside>

          {/* CENTER COLUMN: Sections 1 to 9 (6 cols) */}
          <article
            className={`lg:col-span-6 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-7 ${cardBgClass} ${bodySizeClass}`}
          >
            {/* Section 1: Information we collect */}
            <section
              id="information-we-collect"
              className="scroll-mt-24 space-y-3"
            >
              <h2
                className={`${headingSizeClass} font-extrabold tracking-tight flex items-baseline gap-2.5`}
              >
                <span>1.</span>
                <span>Information we collect</span>
              </h2>
              <p className={mutedTextClass}>
                We collect limited information to provide and improve our
                website and calculators. This may include:
              </p>
              <ul className={`list-disc pl-5 space-y-2 ${mutedTextClass}`}>
                <li>
                  <strong
                    className={
                      isDarkMode ? 'text-white font-bold' : 'text-[#0F1B33] font-bold'
                    }
                  >
                    Information you provide:
                  </strong>{' '}
                  such as details you enter in a contact form or when reporting
                  a calculation error.
                </li>
                <li>
                  <strong
                    className={
                      isDarkMode ? 'text-white font-bold' : 'text-[#0F1B33] font-bold'
                    }
                  >
                    Automatically collected information:
                  </strong>{' '}
                  such as basic device information, browser type, pages visited
                  and approximate location (e.g. country or region).
                </li>
                <li>
                  <strong
                    className={
                      isDarkMode ? 'text-white font-bold' : 'text-[#0F1B33] font-bold'
                    }
                  >
                    Cookies and similar technologies:
                  </strong>{' '}
                  used for essential site functionality, analytics and
                  advertising (if enabled).
                </li>
              </ul>

              {/* Blue info callout box */}
              <div
                className={
                  isDarkMode
                    ? 'mt-3 rounded-xl bg-[#182949] border border-[#2B4470] p-3.5 flex items-start gap-3 text-[13.5px] text-[#E2E8F0]'
                    : isHighContrast
                    ? 'mt-3 rounded-xl bg-[#EEF4FF] border-2 border-black p-3.5 flex items-start gap-3 text-[13.5px] text-black font-medium'
                    : 'mt-3 rounded-xl bg-[#F1F6FF] border border-[#DCE8FF] p-3.5 flex items-start gap-3 text-[13.5px] text-[#2B3B55]'
                }
              >
                <span className="w-5 h-5 rounded-full bg-[#0A58ED] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
                <p className="leading-relaxed">
                  We only collect information that helps us operate, improve and
                  keep the website useful for our visitors.
                </p>
              </div>
            </section>

            {/* Section 2: How calculator inputs are processed */}
            <section
              id="how-calculator-inputs-are-processed"
              className="scroll-mt-24 space-y-2.5"
            >
              <h2
                className={`${headingSizeClass} font-extrabold tracking-tight flex items-baseline gap-2.5`}
              >
                <span>2.</span>
                <span>How calculator inputs are processed</span>
              </h2>
              <p className={mutedTextClass}>
                The values you enter in our calculators are processed directly
                in your browser using JavaScript. They are not sent to our
                servers or stored by us. This means your calculations remain
                private on your device.
              </p>
            </section>

            {/* Section 3: Cookies and analytics */}
            <section
              id="cookies-and-analytics"
              className="scroll-mt-24 space-y-2.5"
            >
              <h2
                className={`${headingSizeClass} font-extrabold tracking-tight flex items-baseline gap-2.5`}
              >
                <span>3.</span>
                <span>Cookies and analytics</span>
              </h2>
              <p className={mutedTextClass}>
                We use cookies and similar technologies to:
              </p>
              <ul className={`list-disc pl-5 space-y-1.5 ${mutedTextClass}`}>
                <li>Keep the website working properly (essential cookies).</li>
                <li>
                  Understand how visitors use our site (analytics, e.g. Google
                  Analytics).
                </li>
                <li>
                  Remember your preferences (such as theme or text size).
                </li>
              </ul>
              <p className={`pt-1 ${mutedTextClass}`}>
                These tools may collect information such as your browser type,
                device type, pages visited and approximate location. The data is
                used in an aggregated form to help us improve the website.
              </p>
            </section>

            {/* Section 4: Advertising technologies */}
            <section
              id="advertising-technologies"
              className="scroll-mt-24 space-y-2.5"
            >
              <h2
                className={`${headingSizeClass} font-extrabold tracking-tight flex items-baseline gap-2.5`}
              >
                <span>4.</span>
                <span>Advertising technologies</span>
              </h2>
              <p className={mutedTextClass}>
                We may use third-party advertising services (such as Google
                AdSense) to show relevant ads. These services can use cookies
                and similar technologies to show personalized or
                non-personalized ads based on your activity on our site and
                other websites. You can manage your ad preferences through your
                browser settings or the tools provided by the advertising
                networks.
              </p>
            </section>

            {/* Section 5: Your choices */}
            <section id="your-choices" className="scroll-mt-24 space-y-2.5">
              <h2
                className={`${headingSizeClass} font-extrabold tracking-tight flex items-baseline gap-2.5`}
              >
                <span>5.</span>
                <span>Your choices</span>
              </h2>
              <p className={mutedTextClass}>
                You can control or limit data collection in several ways:
              </p>
              <ul className={`list-disc pl-5 space-y-1.5 ${mutedTextClass}`}>
                <li>
                  Adjust your browser settings to block or delete cookies.
                </li>
                <li>
                  Opt out of personalized ads using the tools provided by
                  advertising networks.
                </li>
                <li>
                  Use the accessibility options on this page to customize your
                  viewing experience.
                </li>
                <li>Contact us if you have any questions about your data.</li>
              </ul>
            </section>

            {/* Section 6: Data security and retention */}
            <section
              id="data-security-and-retention"
              className="scroll-mt-24 space-y-2.5"
            >
              <h2
                className={`${headingSizeClass} font-extrabold tracking-tight flex items-baseline gap-2.5`}
              >
                <span>6.</span>
                <span>Data security and retention</span>
              </h2>
              <p className={mutedTextClass}>
                We take reasonable measures to protect the information we
                collect from unauthorized access, alteration or loss. We keep
                information only for as long as needed to provide our services,
                improve the website or comply with legal obligations.
              </p>
            </section>

            {/* Section 7: Accessibility commitment */}
            <section
              id="accessibility-commitment"
              className="scroll-mt-24 space-y-2.5"
            >
              <h2
                className={`${headingSizeClass} font-extrabold tracking-tight flex items-baseline gap-2.5`}
              >
                <span>7.</span>
                <span>Accessibility commitment</span>
              </h2>
              <p className={mutedTextClass}>
                We aim to make SolveItCalculator usable for as many people as
                possible, including people with disabilities and those using
                assistive technologies. We follow widely accepted web
                accessibility guidelines such as the Web Content Accessibility
                Guidelines (WCAG) 2.1 where possible and continue to improve the
                site.
              </p>
            </section>

            {/* Section 8: How to contact us */}
            <section
              id="how-to-contact-us"
              className="scroll-mt-24 space-y-2.5"
            >
              <h2
                className={`${headingSizeClass} font-extrabold tracking-tight flex items-baseline gap-2.5`}
              >
                <span>8.</span>
                <span>How to contact us</span>
              </h2>
              <p className={mutedTextClass}>
                If you have any questions about this Privacy Policy, our data
                practices, or accessibility, please use our{' '}
                <Link
                  href="/contact"
                  className="text-[#0A58ED] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] rounded-xs"
                >
                  Contact page
                </Link>
                . We welcome your feedback and suggestions.
              </p>
            </section>

            {/* Section 9: Technical details (optional) Expandable Accordion */}
            <section id="technical-details" className="scroll-mt-24 pt-1">
              <div
                className={
                  isDarkMode
                    ? 'rounded-xl bg-[#182949] border border-[#2B4470] overflow-hidden'
                    : isHighContrast
                    ? 'rounded-xl bg-[#F0F4FF] border-2 border-black overflow-hidden'
                    : 'rounded-xl bg-[#F3F7FF] border border-[#DCE8FF] overflow-hidden'
                }
              >
                <button
                  type="button"
                  onClick={() => setTechnicalOpen(!technicalOpen)}
                  aria-expanded={technicalOpen}
                  aria-controls="technical-details-panel"
                  className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#0A58ED] text-white flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="text-[14.5px] font-extrabold">
                        9. Technical details (optional)
                      </div>
                      <div className={`text-xs ${mutedTextClass}`}>
                        Learn more about cookies, third-party services and data
                        usage.
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#0A58ED] shrink-0 ${transitionClass} ${
                      technicalOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {technicalOpen && (
                  <div
                    id="technical-details-panel"
                    className={`px-4 pb-4 pt-2 border-t border-[#DCE8FF]/80 text-[13.5px] space-y-2.5 ${mutedTextClass}`}
                  >
                    <p>
                      <strong className="font-bold">
                        Client-side execution:
                      </strong>{' '}
                      All mathematical, financial, unit conversion, and health
                      formulas run directly inside your browser&apos;s
                      JavaScript engine. Form inputs inside calculators are held
                      only in temporary browser memory (`React` component state)
                      and are cleared when you close or reload the tab.
                    </p>
                    <p>
                      <strong className="font-bold">
                        Local storage preferences:
                      </strong>{' '}
                      When you adjust text size, display mode, or reduced motion
                      in the Accessibility options panel, those settings are
                      stored locally on your device using{' '}
                      <code className="px-1.5 py-0.5 rounded bg-white/80 text-[#0A58ED] font-mono text-xs">
                        localStorage
                      </code>{' '}
                      under the key{' '}
                      <code className="px-1.5 py-0.5 rounded bg-white/80 text-[#0A58ED] font-mono text-xs">
                        solveit_a11y_prefs
                      </code>
                      .
                    </p>
                    <p>
                      <strong className="font-bold">
                        Keyboard &amp; screen reader support:
                      </strong>{' '}
                      Pages use semantic HTML landmarks (`header`, `nav`,
                      `main`, `article`, `aside`, `footer`), explicit form
                      labels, keyboard focus rings (`:focus-visible`), and ARIA
                      attributes so screen readers and keyboard-only visitors
                      can navigate smoothly.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </article>

          {/* RIGHT COLUMN: 4 Stacked Sidebar Cards (3 cols) */}
          <aside className="lg:col-span-3 space-y-5">
            {/* Card 1: Accessibility options */}
            <section
              aria-labelledby="a11y-options-heading"
              className={`rounded-2xl p-5 shadow-2xs space-y-4 ${cardBgClass}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#EBF3FF] text-[#0A58ED] flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" aria-hidden="true" />
                </span>
                <h2
                  id="a11y-options-heading"
                  className="text-[15.5px] font-extrabold tracking-tight"
                >
                  Accessibility options
                </h2>
              </div>

              <p className={`text-xs leading-relaxed ${mutedTextClass}`}>
                Customize your experience on this site. These settings help make
                the content easier to read and use.
              </p>

              {/* Text size control */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold">Text size</div>
                <div
                  role="group"
                  aria-label="Text size"
                  className="grid grid-cols-3 gap-2"
                >
                  {(
                    [
                      {
                        id: 'small',
                        label: 'Small',
                        aaSize: 'text-xs font-bold',
                      },
                      {
                        id: 'medium',
                        label: 'Medium',
                        aaSize: 'text-sm font-extrabold',
                      },
                      {
                        id: 'large',
                        label: 'Large',
                        aaSize: 'text-base font-extrabold',
                      },
                    ] as const
                  ).map((opt) => {
                    const selected = prefs.textSize === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setPrefs((prev) => ({ ...prev, textSize: opt.id }))
                        }
                        aria-pressed={selected}
                        className={`py-2 px-2 rounded-xl border text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${transitionClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] ${
                          selected
                            ? 'bg-[#0A58ED] border-[#0A58ED] text-white shadow-2xs'
                            : isDarkMode
                            ? 'bg-[#182949] border-[#2B4470] text-[#E2E8F0] hover:border-[#0A58ED]'
                            : 'bg-white border-[#DCE5F2] text-[#0F1B33] hover:border-[#0A58ED]'
                        }`}
                      >
                        <span className={opt.aaSize}>Aa</span>
                        <span
                          className={`text-[11px] ${
                            selected ? 'text-white font-semibold' : mutedTextClass
                          }`}
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display mode control */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold">Display mode</div>
                <div
                  role="group"
                  aria-label="Display mode"
                  className="grid grid-cols-3 gap-2"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setPrefs((prev) => ({ ...prev, displayMode: 'default' }))
                    }
                    aria-pressed={prefs.displayMode === 'default'}
                    className={`py-2.5 px-1.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${transitionClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] ${
                      prefs.displayMode === 'default'
                        ? 'bg-[#EDF4FF] border-[#0A58ED] text-[#0A58ED] font-bold shadow-2xs'
                        : isDarkMode
                        ? 'bg-[#182949] border-[#2B4470] text-[#E2E8F0] hover:border-[#0A58ED]'
                        : 'bg-white border-[#DCE5F2] text-[#3B4A64] hover:border-[#0A58ED]'
                    }`}
                  >
                    <Sun className="w-4 h-4" aria-hidden="true" />
                    <span className="text-[11px] leading-tight">Default</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPrefs((prev) => ({
                        ...prev,
                        displayMode: 'high-contrast',
                      }))
                    }
                    aria-pressed={prefs.displayMode === 'high-contrast'}
                    className={`py-2.5 px-1.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${transitionClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] ${
                      prefs.displayMode === 'high-contrast'
                        ? 'bg-[#EDF4FF] border-[#0A58ED] text-[#0A58ED] font-bold shadow-2xs'
                        : isDarkMode
                        ? 'bg-[#182949] border-[#2B4470] text-[#E2E8F0] hover:border-[#0A58ED]'
                        : 'bg-white border-[#DCE5F2] text-[#3B4A64] hover:border-[#0A58ED]'
                    }`}
                  >
                    <Contrast className="w-4 h-4" aria-hidden="true" />
                    <span className="text-[11px] leading-tight">
                      High
                      <br />
                      contrast
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPrefs((prev) => ({ ...prev, displayMode: 'dark' }))
                    }
                    aria-pressed={prefs.displayMode === 'dark'}
                    className={`py-2.5 px-1.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${transitionClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] ${
                      prefs.displayMode === 'dark'
                        ? 'bg-[#0A58ED] border-[#0A58ED] text-white font-bold shadow-2xs'
                        : 'bg-white border-[#DCE5F2] text-[#3B4A64] hover:border-[#0A58ED]'
                    }`}
                  >
                    <Moon className="w-4 h-4" aria-hidden="true" />
                    <span className="text-[11px] leading-tight">
                      Dark
                      <br />
                      mode
                    </span>
                  </button>
                </div>
              </div>

              {/* Reduce motion toggle */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-extrabold">Reduce motion</div>
                <p className={`text-xs leading-relaxed ${mutedTextClass}`}>
                  Minimize animations and motion effects across the site.
                </p>

                <div className="flex items-center gap-2.5 pt-0.5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs.reduceMotion}
                    aria-label="Reduce motion"
                    onClick={() =>
                      setPrefs((prev) => ({
                        ...prev,
                        reduceMotion: !prev.reduceMotion,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent ${transitionClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] ${
                      prefs.reduceMotion ? 'bg-[#0A58ED]' : 'bg-[#CBD5E1]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ${transitionClass} ${
                        prefs.reduceMotion ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={`text-xs font-medium ${mutedTextClass}`}>
                    Reduce motion
                  </span>
                </div>
              </div>

              {/* Honest accessibility disclaimer box */}
              <div
                className={
                  isDarkMode
                    ? 'rounded-xl bg-[#182949] border border-[#2B4470] p-3 flex items-start gap-2.5 text-[11.5px] text-[#CBD5E1]'
                    : 'rounded-xl bg-[#F1F6FF] border border-[#DCE8FF] p-3 flex items-start gap-2.5 text-[11.5px] text-[#475569]'
                }
              >
                <span className="w-4 h-4 rounded-full bg-[#0A58ED] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-3 h-3" aria-hidden="true" />
                </span>
                <p className="leading-relaxed">
                  These options improve accessibility but may not make all parts
                  of the site fully accessible for everyone.
                </p>
              </div>
            </section>

            {/* Card 2: Quick links */}
            <section
              aria-labelledby="quick-links-heading"
              className={`rounded-2xl p-5 shadow-2xs space-y-3 ${cardBgClass}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#EBF3FF] text-[#0A58ED] flex items-center justify-center shrink-0">
                  <Link2 className="w-4 h-4" aria-hidden="true" />
                </span>
                <h2
                  id="quick-links-heading"
                  className="text-[15.5px] font-extrabold tracking-tight"
                >
                  Quick links
                </h2>
              </div>

              <ul className="space-y-2 text-[13.5px] pl-1">
                <li className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#0A58ED] shrink-0"
                    aria-hidden="true"
                  />
                  <Link
                    href="/contact"
                    className="text-[#0A58ED] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] rounded-xs"
                  >
                    Contact us
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#0A58ED] shrink-0"
                    aria-hidden="true"
                  />
                  <Link
                    href="/about"
                    className="text-[#0A58ED] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] rounded-xs"
                  >
                    About SolveItCalculator
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#0A58ED] shrink-0"
                    aria-hidden="true"
                  />
                  <Link
                    href="/calculation-methodology"
                    className="text-[#0A58ED] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] rounded-xs"
                  >
                    Calculation Methodology
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#0A58ED] shrink-0"
                    aria-hidden="true"
                  />
                  <Link
                    href="/calculators"
                    className="text-[#0A58ED] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] rounded-xs"
                  >
                    All Calculators
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#0A58ED] shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href="#accessibility-commitment"
                    onClick={(e) =>
                      handleTocClick(e, 'accessibility-commitment')
                    }
                    className="text-[#0A58ED] font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED] rounded-xs"
                  >
                    Accessibility help
                  </a>
                </li>
              </ul>
            </section>

            {/* Card 3: Key points */}
            <section
              aria-labelledby="key-points-heading"
              className={`rounded-2xl p-5 shadow-2xs space-y-3.5 ${cardBgClass}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#FFF8E6] text-[#D97706] border border-[#FDE68A] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4" aria-hidden="true" />
                </span>
                <h2
                  id="key-points-heading"
                  className="text-[15.5px] font-extrabold tracking-tight"
                >
                  Key points
                </h2>
              </div>

              <ul className={`space-y-2.5 text-xs leading-relaxed ${mutedTextClass}`}>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#0E9F6E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>Your calculations stay on your device.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#0E9F6E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    We use cookies for essential features, analytics and
                    advertising.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#0E9F6E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>You can control your data preferences.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="w-4 h-4 text-[#0E9F6E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    We are committed to improving accessibility for all users.
                  </span>
                </li>
              </ul>
            </section>

            {/* Card 4: Have a question? (Soft mint-green card) */}
            <section
              aria-labelledby="have-question-heading"
              className={
                isDarkMode
                  ? 'rounded-2xl bg-[#112A26] border border-[#1E4E45] p-5 shadow-2xs space-y-3.5'
                  : 'rounded-2xl bg-[#EBF9F3] border border-[#CBEBD9] p-5 shadow-2xs space-y-3.5'
              }
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-[#129468] text-white flex items-center justify-center shrink-0">
                  <MessageCircleMore className="w-4 h-4" aria-hidden="true" />
                </span>
                <h2
                  id="have-question-heading"
                  className="text-[15.5px] font-extrabold tracking-tight"
                >
                  Have a question?
                </h2>
              </div>

              <p className={`text-xs leading-relaxed ${mutedTextClass}`}>
                If you need more information or have specific concerns, please
                contact us through our contact page.
              </p>

              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0A58ED] hover:bg-[#0847C2] text-white text-[13px] font-bold shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED]"
              >
                <span>Go to Contact Page</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
