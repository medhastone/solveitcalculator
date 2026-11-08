'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Target,
  Users,
  Settings,
  ArrowRight,
  Lightbulb,
  ClipboardCheck,
  BookOpen,
  MessageCircle,
  ShieldCheck,
  FileText,
  Link2,
  Calculator,
  BarChart3,
  Check,
  MousePointerClick,
  ChevronDown,
} from 'lucide-react';

interface UnitOption {
  label: string;
  symbol: string;
  rate: number;
  convertedUnit: string;
  formulaLabel: string;
}

const DEMO_UNIT_OPTIONS: Record<string, UnitOption> = {
  'Metres (m)': {
    label: 'Metres (m)',
    symbol: 'm',
    rate: 15,
    convertedUnit: 'm',
    formulaLabel: 'Result = Value × Rate ÷ 100',
  },
  'Centimetres (cm)': {
    label: 'Centimetres (cm)',
    symbol: 'cm',
    rate: 1,
    convertedUnit: 'm',
    formulaLabel: 'Metres = Centimetres × 1 ÷ 100',
  },
  'Feet (ft)': {
    label: 'Feet (ft)',
    symbol: 'ft',
    rate: 30.48,
    convertedUnit: 'm',
    formulaLabel: 'Metres = Feet × 30.48 ÷ 100',
  },
  'Percent (%)': {
    label: 'Percent (%)',
    symbol: '%',
    rate: 25,
    convertedUnit: 'of 250',
    formulaLabel: 'Result = Value × Rate ÷ 100',
  },
};

export default function AboutMethodologyClient() {
  const [demoInput, setDemoInput] = useState<string>('100');
  const [demoUnit, setDemoUnit] = useState<string>('Metres (m)');
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const numericValue = parseFloat(demoInput);
  const validNumber = !Number.isNaN(numericValue) ? numericValue : 0;
  const activeOption =
    DEMO_UNIT_OPTIONS[demoUnit] || DEMO_UNIT_OPTIONS['Metres (m)'];
  const computedResult = Number(
    ((validNumber * activeOption.rate) / 100).toFixed(4)
  );

  const handleCalculateClick = () => {
    setHasInteracted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* Top Hero Banner with Breadcrumb, Centered H1 & Left/Right Illustrations */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-b from-[#EAF2FF] via-[#F2F6FF] to-[#F5F7FA] pt-5 pb-10">
        {/* Soft background decorative radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(36,87,214,0.08),_transparent_70%)]"
        />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb: Home > About */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs sm:text-sm text-[#475569]"
          >
            <Link
              href="/"
              className="text-[#2457D6] hover:underline transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
            >
              Home
            </Link>
            <ChevronRight
              className="w-3.5 h-3.5 text-[#94A3B8]"
              aria-hidden="true"
            />
            <span className="font-semibold text-[#2457D6]" aria-current="page">
              About
            </span>
          </nav>

          {/* Hero 3-Zone Grid: Left Illustration | Center Copy | Right Globe Illustration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-1">
            {/* Left Illustration: Calculator + 123 Window + Green Checkmark */}
            <div
              aria-hidden="true"
              className="hidden lg:flex lg:col-span-3 items-center justify-start select-none"
            >
              <div className="relative w-60 h-44 flex items-center justify-center">
                {/* Soft circle backdrop */}
                <div className="absolute w-44 h-44 rounded-full bg-[#DCE9FF]/75 -left-2 top-1" />
                {/* Secondary Browser/Sheet Card with 123 */}
                <div className="relative z-10 w-36 h-28 rounded-xl bg-white/95 border border-[#C7DCFE] shadow-sm p-2.5 rotate-6 translate-x-6 -translate-y-3">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#93C5FD]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#93C5FD]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#93C5FD]" />
                  </div>
                  <div className="bg-[#EEF4FF] rounded-md px-2 py-1 text-right font-extrabold text-sm text-[#2457D6] tabular-nums">
                    123
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <div className="h-2 w-4/5 rounded bg-[#DCE9FF]" />
                    <div className="h-2 w-3/5 rounded bg-[#E2E8F0]" />
                  </div>
                </div>

                {/* Foreground Blue Calculator */}
                <div className="absolute left-5 bottom-2 z-20 w-28 rounded-2xl bg-gradient-to-b from-[#2457D6] to-[#1D47B0] p-3 shadow-md -rotate-12 border border-[#60A5FA]/40">
                  <div className="bg-[#DBEAFE] rounded-md h-5 mb-2.5 px-1.5 flex items-center justify-end">
                    <span className="w-8 h-2 rounded bg-[#93C5FD]" />
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Array.from({ length: 9 }).map((_, idx) => (
                      <span
                        key={idx}
                        className="h-3.5 rounded-xs bg-[#EFF6FF]/90"
                      />
                    ))}
                  </div>
                </div>

                {/* Green Verification Checkmark Circle */}
                <div className="absolute right-7 bottom-4 z-30 w-12 h-12 rounded-full bg-[#22A06B] text-white flex items-center justify-center shadow-md border-2 border-white">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* Center Headline & Purpose Statement */}
            <div className="lg:col-span-6 text-center space-y-3.5 max-w-2xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#152238] leading-tight">
                How SolveItCalculator{' '}
                <span className="text-[#2457D6]">Works</span>
              </h1>
              <p className="text-base sm:text-lg font-semibold text-[#152238]">
                Making calculations understandable, accessible and useful for
                everyone.
              </p>
              <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                SolveItCalculator.com is a free online platform that helps
                people solve everyday calculations with clear answers and simple
                explanations. Our goal is to make math, finance, unit conversion
                and many other calculations easy to understand for everyone
                around the world.
              </p>
            </div>

            {/* Right Illustration: Globe with Floating Calculator, Chart & Lightbulb Badges */}
            <div
              aria-hidden="true"
              className="hidden lg:flex lg:col-span-3 items-center justify-end select-none"
            >
              <div className="relative w-60 h-44 flex items-center justify-center">
                {/* Dashed Orbit Ring */}
                <div className="absolute w-44 h-44 rounded-full border border-dashed border-[#93C5FD]" />
                {/* Globe Circle */}
                <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-[#B8D4FE] via-[#90BDFE] to-[#68A2FA] shadow-inner overflow-hidden flex items-center justify-center border-2 border-white/80">
                  {/* Stylized Continents */}
                  <div className="absolute -left-3 top-4 w-16 h-20 rounded-full bg-[#DCEAFE]/75 rotate-12" />
                  <div className="absolute right-2 bottom-3 w-20 h-16 rounded-full bg-[#DCEAFE]/75 -rotate-12" />
                  <div className="absolute top-2 right-6 w-10 h-8 rounded-full bg-[#DCEAFE]/65" />
                </div>

                {/* Top Gold Calculator Badge */}
                <div className="absolute -top-1 left-16 z-20 w-11 h-11 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-md border-2 border-white">
                  <Calculator className="w-5 h-5" />
                </div>

                {/* Right Blue Bar Chart Badge */}
                <div className="absolute top-10 right-4 z-20 w-11 h-11 rounded-full bg-[#2457D6] text-white flex items-center justify-center shadow-md border-2 border-white">
                  <BarChart3 className="w-5 h-5" />
                </div>

                {/* Bottom-Right Green Lightbulb Badge */}
                <div className="absolute bottom-1 right-6 z-20 w-11 h-11 rounded-full bg-[#16856B] text-white flex items-center justify-center shadow-md border-2 border-white">
                  <Lightbulb className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* 1. Three-Column Identity Row: Our mission | Who we are | What we do */}
        <section
          aria-label="Mission and platform overview"
          className="bg-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-6 sm:p-7"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-0 lg:divide-x lg:divide-[#E2E8F0]">
            {/* Column 1: Our mission */}
            <div className="lg:pr-7 flex items-start gap-4">
              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#2457D6] flex items-center justify-center shrink-0"
              >
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
                  Our mission
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  To make calculations simple, accurate and accessible for
                  everyone, no matter their age, background or location. We
                  believe that clear information and practical tools can help
                  people make better decisions in education, work and everyday
                  life.
                </p>
              </div>
            </div>

            {/* Column 2: Who we are */}
            <div className="lg:px-7 flex items-start gap-4">
              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-2xl bg-[#E6F6F1] text-[#16856B] flex items-center justify-center shrink-0"
              >
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
                  Who we are
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  SolveItCalculator.com is an independent online platform
                  created and maintained by a small team of builders, writers
                  and researchers led by founder{' '}
                  <strong className="font-semibold text-[#152238]">
                    Krchandan
                  </strong>
                  , who are passionate about useful tools and clear
                  explanations. We focus on creating reliable calculators and
                  easy-to-understand guides for real people.
                </p>
              </div>
            </div>

            {/* Column 3: What we do */}
            <div className="lg:pl-7 flex items-start gap-4">
              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-2xl bg-[#EEECFF] text-[#2457D6] flex items-center justify-center shrink-0"
              >
                <Settings className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
                  What we do
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  We develop free calculators for a wide range of topics,
                  including math, finance, unit conversion, date and time,
                  health and fitness, home and construction, business and
                  science. Each calculator comes with a simple interface, clear
                  results and helpful explanations so you can understand how the
                  calculation works.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Full-Width 3-Step Visual Section: How our calculators work */}
        <section
          aria-labelledby="heading-how-calculators-work"
          className="bg-[#F2F6FD] rounded-2xl border border-[#DCE5F2] shadow-2xs p-6 sm:p-7 space-y-5"
        >
          {/* Section Header */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-white border border-[#DCE5F2] text-[#2457D6] flex items-center justify-center shrink-0 shadow-2xs"
            >
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="heading-how-calculators-work"
                className="text-lg sm:text-xl font-extrabold text-[#152238]"
              >
                How our calculators work
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                Every calculator on SolveItCalculator follows the same simple
                process.
              </p>
            </div>
          </div>

          {/* 4-Card Process Grid (Steps 1, 2, 3 + More than just a result) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
            {/* Step 1: Enter your values */}
            <div className="lg:col-span-3 relative bg-white rounded-xl border border-[#DCE5F2] p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="w-8 h-8 rounded-full bg-[#0A58ED] text-white font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5"
                >
                  1
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-[15px] font-extrabold text-[#152238]">
                    Enter your values
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Fill in the required fields with your numbers and choose the
                    units if needed.
                  </p>
                </div>
              </div>

              {/* Interactive Input + Unit Selector matching the screenshot */}
              <div className="mt-4 pt-1">
                <div className="flex items-stretch rounded-lg border border-[#CBD5E1] bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#2457D6]">
                  <label htmlFor="demo-step-value" className="sr-only">
                    Example value
                  </label>
                  <input
                    id="demo-step-value"
                    type="number"
                    value={demoInput}
                    onChange={(e) => {
                      setDemoInput(e.target.value);
                      setHasInteracted(true);
                    }}
                    className="w-24 sm:w-28 px-3 py-2 text-sm font-bold text-[#152238] bg-white border-r border-[#CBD5E1] focus:outline-none tabular-nums"
                  />
                  <div className="relative flex-1 bg-[#F8FAFC]">
                    <label htmlFor="demo-step-unit" className="sr-only">
                      Select unit
                    </label>
                    <select
                      id="demo-step-unit"
                      value={demoUnit}
                      onChange={(e) => {
                        setDemoUnit(e.target.value);
                        setHasInteracted(true);
                      }}
                      className="w-full h-full appearance-none bg-transparent pl-2.5 pr-7 py-2 text-xs font-semibold text-[#152238] focus:outline-none cursor-pointer"
                    >
                      {Object.keys(DEMO_UNIT_OPTIONS).map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="w-3.5 h-3.5 text-[#475569] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop connector arrow to Step 2 */}
              <div
                aria-hidden="true"
                className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white border border-[#DCE5F2] items-center justify-center text-[#2457D6] shadow-2xs"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2: Calculate the result */}
            <div className="lg:col-span-3 relative bg-white rounded-xl border border-[#DCE5F2] p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="w-8 h-8 rounded-full bg-[#0A58ED] text-white font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5"
                >
                  2
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-[15px] font-extrabold text-[#152238]">
                    Calculate the result
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Our calculator instantly processes your input and shows the
                    result using the correct formula.
                  </p>
                </div>
              </div>

              {/* Interactive Calculate Button with Click Indicator */}
              <div className="mt-4 pt-1 flex items-center justify-center">
                <div className="relative w-full max-w-[200px]">
                  <button
                    type="button"
                    onClick={handleCalculateClick}
                    className="w-full py-2.5 px-5 rounded-lg bg-[#0A58ED] hover:bg-[#1D47B0] text-white font-bold text-sm shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
                  >
                    Calculate
                  </button>
                  <MousePointerClick
                    aria-hidden="true"
                    className="w-5 h-5 text-[#152238] fill-white absolute -bottom-2 -right-2 drop-shadow-xs pointer-events-none"
                  />
                </div>
              </div>

              {/* Desktop connector arrow to Step 3 */}
              <div
                aria-hidden="true"
                className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-white border border-[#DCE5F2] items-center justify-center text-[#2457D6] shadow-2xs"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3: Understand the method */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-[#DCE5F2] p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="w-8 h-8 rounded-full bg-[#0A58ED] text-white font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5"
                >
                  3
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-[15px] font-extrabold text-[#152238]">
                    Understand the method
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    You also get a step-by-step explanation, formula and related
                    information to help you learn.
                  </p>
                </div>
              </div>

              {/* Formula Box + Live Interactive Output */}
              <div className="mt-4 bg-[#EEF4FF] border border-[#CFE0FC] rounded-lg px-3.5 py-2.5 space-y-1">
                <p className="text-[11px] font-bold text-[#2457D6]">Formula:</p>
                <p className="text-xs sm:text-[13px] font-extrabold text-[#0A58ED] tabular-nums">
                  {activeOption.formulaLabel}
                </p>
                {hasInteracted && (
                  <p className="text-[11px] font-bold text-[#16856B] pt-0.5 border-t border-[#CFE0FC]/70 tabular-nums">
                    Live output: {validNumber} × {activeOption.rate} ÷ 100 ={' '}
                    {computedResult} {activeOption.convertedUnit}
                  </p>
                )}
              </div>
            </div>

            {/* Card 4: More than just a result (Soft Green Callout) */}
            <div className="lg:col-span-3 bg-[#EBF9F3] rounded-xl border border-[#C6ECE0] p-4 sm:p-5 flex items-start gap-3 shadow-2xs">
              <div
                aria-hidden="true"
                className="w-9 h-9 rounded-xl bg-white border border-[#BDE5D7] text-[#F59E0B] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
              >
                <Lightbulb className="w-5 h-5 text-[#2457D6] fill-[#FACC15]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-[15px] font-extrabold text-[#152238]">
                  More than just a result
                </h3>
                <p className="text-xs text-[#334155] leading-relaxed">
                  We don&apos;t just give you an answer. We show you how the
                  calculation works, what the result means and share useful tips
                  and related tools to help you learn and apply it confidently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Six-Card Methodology & Transparency Grid (3 Rows × 2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: How we test calculation accuracy */}
          <section
            id="testing-accuracy"
            aria-labelledby="heading-testing-accuracy"
            className="bg-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-6 flex items-start gap-4"
          >
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0 mt-0.5"
            >
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h2
                id="heading-testing-accuracy"
                className="text-lg sm:text-xl font-extrabold text-[#152238]"
              >
                How we test calculation accuracy
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                We carefully build each calculator using standard mathematical
                formulas and widely accepted methods. Before publishing, we test
                each calculator with multiple values, edge cases and unit
                conversions to make sure the results are correct and consistent.
                We also compare results with trusted references and real-world
                examples.
              </p>
            </div>
          </section>

          {/* Card 2: Sources and assumptions */}
          <section
            id="sources-and-assumptions"
            aria-labelledby="heading-sources"
            className="bg-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-6 flex items-start gap-4"
          >
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0 mt-0.5"
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h2
                id="heading-sources"
                className="text-lg sm:text-xl font-extrabold text-[#152238]"
              >
                Sources and assumptions
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Our calculators are based on standard mathematical principles
                and commonly accepted formulas from reliable sources such as
                textbooks, educational resources and official guidelines. Some
                calculators may use default values or assumptions (for example,
                number of days in a year, waste allowance, or tax rates) which
                are clearly mentioned on the tool page. You can adjust these
                values to match your own needs.
              </p>
            </div>
          </section>

          {/* Card 3: Corrections and feedback */}
          <section
            id="corrections-and-feedback"
            aria-labelledby="heading-corrections"
            className="bg-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-6 flex items-start gap-4"
          >
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0 mt-0.5"
            >
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="space-y-3">
              <h2
                id="heading-corrections"
                className="text-lg sm:text-xl font-extrabold text-[#152238]"
              >
                Corrections and feedback
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                We always aim to provide accurate and helpful tools, but if you
                find an error, have a suggestion or want to see a new
                calculator, please let us know. We review all feedback and make
                corrections or improvements as soon as possible.
              </p>
              <div className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#93C5FD] bg-white hover:bg-[#EEF4FF] text-[#0A58ED] font-bold text-xs sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <span>Contact us</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          {/* Card 4: Privacy and data handling */}
          <section
            id="privacy-and-data"
            aria-labelledby="heading-privacy"
            className="bg-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-6 flex items-start gap-4"
          >
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0 mt-0.5"
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-3">
              <h2
                id="heading-privacy"
                className="text-lg sm:text-xl font-extrabold text-[#152238]"
              >
                Privacy and data handling
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                SolveItCalculator is designed to be safe and private to use.
                Most of our calculators work directly in your browser and do not
                store your personal information. We do not require an account to
                use our tools. For more details, please read our{' '}
                <Link
                  href="/privacy-policy"
                  className="text-[#0A58ED] font-bold hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="pt-1">
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#93C5FD] bg-white hover:bg-[#EEF4FF] text-[#0A58ED] font-bold text-xs sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <span>View Privacy Policy</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          {/* Card 5: Examples and guides */}
          <section
            id="examples-and-guides"
            aria-labelledby="heading-examples-guides"
            className="bg-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-6 flex items-start gap-4"
          >
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0 mt-0.5"
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-3">
              <h2
                id="heading-examples-guides"
                className="text-lg sm:text-xl font-extrabold text-[#152238]"
              >
                Examples and guides
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                In addition to our calculators, we also provide easy-to-follow
                guides, examples and explanations to help you understand
                different types of calculations. You can explore our{' '}
                <Link
                  href="/guides"
                  className="text-[#0A58ED] font-bold hover:underline"
                >
                  Guides section
                </Link>{' '}
                for step-by-step articles and real-life examples.
              </p>
              <div className="pt-1">
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#93C5FD] bg-white hover:bg-[#EEF4FF] text-[#0A58ED] font-bold text-xs sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <span>Browse Guides</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>

          {/* Card 6: Related pages */}
          <section
            id="related-pages"
            aria-labelledby="heading-related-pages"
            className="bg-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-6 flex items-start gap-4"
          >
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0 mt-0.5"
            >
              <Link2 className="w-5 h-5" />
            </div>
            <div className="space-y-2.5">
              <h2
                id="heading-related-pages"
                className="text-lg sm:text-xl font-extrabold text-[#152238]"
              >
                Related pages
              </h2>
              <p className="text-xs sm:text-sm text-[#475569]">
                You may also be interested in:
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#0A58ED]"
                  />
                  <Link
                    href="/calculators"
                    className="font-semibold text-[#0A58ED] hover:underline"
                  >
                    All Calculators
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#0A58ED]"
                  />
                  <Link
                    href="/#popular-calculators"
                    className="font-semibold text-[#0A58ED] hover:underline"
                  >
                    Popular Calculators
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#0A58ED]"
                  />
                  <Link
                    href="/calculation-methodology"
                    className="font-semibold text-[#0A58ED] hover:underline"
                  >
                    Calculation Methodology
                  </Link>
                  <span className="text-[#64748B]">(this page)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#0A58ED]"
                  />
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-[#0A58ED] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#0A58ED]"
                  />
                  <Link
                    href="/contact"
                    className="font-semibold text-[#0A58ED] hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
