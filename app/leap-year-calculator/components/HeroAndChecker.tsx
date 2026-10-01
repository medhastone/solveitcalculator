'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LeapYearEvaluation } from '../types';

interface HeroAndCheckerProps {
  inputVal: string;
  setInputVal: (val: string) => void;
  evaluation: LeapYearEvaluation;
  onEvaluate: (year: number) => void;
  onSurpriseMe: () => void;
}

export default function HeroAndChecker({
  inputVal,
  setInputVal,
  evaluation,
  onEvaluate,
  onSurpriseMe,
}: HeroAndCheckerProps) {
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<boolean>(false);

  const handleCheck = () => {
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed)) {
      onEvaluate(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const handleCopyResult = () => {
    const text = `Solveitcalculator.com • Official Calendar Rules\n=========================================\nYear: ${evaluation.year}\nResult: ${
      evaluation.isLeap ? 'LEAP YEAR (366 Days)' : 'COMMON YEAR (365 Days)'
    }\nFebruary Length: ${evaluation.febDays} Days\nRule Met: Rule ${evaluation.ruleIndex}\nExplanation: ${
      evaluation.reason
    }\nNeighboring Leap Years: Prior = ${evaluation.prevLeap}, Next = ${evaluation.nextLeap}\n=========================================\nVerified via https://solveitcalculator.com/leap-year-calculator/`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2200);
        })
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2200);
    } catch {
      // ignore
    }
    document.body.removeChild(ta);
  };

  const handleShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://solveitcalculator.com/leap-year-calculator/';
    if (navigator.share) {
      navigator
        .share({
          title: `Leap Year Calculation for ${evaluation.year}`,
          text: `Check out whether ${evaluation.year} is a leap year on SolveIt:`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setShareFeedback(true);
          setTimeout(() => setShareFeedback(false), 2000);
        });
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col gap-space-2xl">
      {/* Hero & Primary Interactive Checker */}
      <section className="max-w-max-width-calculator mx-auto w-full flex flex-col gap-space-lg" id="leap-year-checker">
        <div className="text-center flex flex-col items-center gap-3">
          {/* Prominent High-Visibility Tags / Badges above Title */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/20 shadow-xs">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              Gregorian Calendar Rules
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20 shadow-xs">
              <span className="material-symbols-outlined text-[14px]">history_toggle_off</span>
              400-Year Cycle Rule
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-500/20 shadow-xs">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              ISO 8601 Standard
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider border border-amber-500/20 shadow-xs">
              <span className="material-symbols-outlined text-[14px]">event_repeat</span>
              February 29 Leap Day
            </span>
          </div>

          <h1 className="font-display-hero text-display-hero md:text-[48px] md:leading-[56px] text-on-surface font-bold tracking-tight">
            Leap Year Calculator
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Is your year a leap year? Check instantly, discover the next leap day, trace astronomical drift, and explore the 400-year Gregorian cycle with mathematical precision.
          </p>
        </div>

        {/* Main Input Workbench Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-lg flex flex-col gap-space-md relative overflow-hidden border border-outline-variant/20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-space-sm">
            <div className="flex-1 flex flex-col gap-space-2xs">
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant flex items-center justify-between" htmlFor="yearInput">
                <span>ENTER YEAR (AD / BC OR ANY YEAR)</span>
                <span className="text-outline font-body-sm text-[11px]">Check any year past, present, or future</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-sm text-outline pointer-events-none text-[22px]">calendar_month</span>
                <input
                  className="w-full pl-11 pr-space-md py-space-sm bg-surface-container-low rounded-lg font-numerical-display text-numerical-display text-on-surface focus:outline-none focus:bg-surface-container-lowest shadow-[0_0_0_1px_rgba(115,118,134,0.2)] focus:shadow-[0_0_0_2px_#2563eb] transition-all"
                  id="yearInput"
                  max="99999"
                  min="-9999"
                  type="number"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <button
              className="px-space-lg py-space-sm bg-primary hover:bg-primary-container text-on-primary rounded-lg font-body-md text-body-md font-semibold flex items-center justify-center gap-space-2xs shadow-sm transition-all transform active:scale-95 shrink-0 h-[52px]"
              id="checkYearBtn"
              type="button"
              onClick={handleCheck}
            >
              <span className="material-symbols-outlined text-[20px]">calculate</span>
              <span>Check Leap Year</span>
            </button>
          </div>

          {/* Preset Chips */}
          <div className="flex flex-col gap-space-2xs">
            <span className="font-label-caps text-label-caps uppercase text-outline">Quick Select Benchmarks</span>
            <div className="flex flex-wrap items-center gap-space-xs" id="quickPresets">
              <button
                className={`px-space-xs py-1 rounded-full font-body-sm text-body-sm transition-colors ${
                  evaluation.year === currentYear
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'bg-surface-container text-on-surface hover:bg-primary/10 hover:text-primary'
                }`}
                type="button"
                onClick={() => {
                  setInputVal(String(currentYear));
                  onEvaluate(currentYear);
                }}
              >
                Current Year
              </button>
              {[2024, 2025, 2028].map((yr) => (
                <button
                  key={yr}
                  className={`px-space-xs py-1 rounded-full font-body-sm text-body-sm transition-colors ${
                    evaluation.year === yr
                      ? 'bg-primary/15 text-primary font-semibold'
                      : 'bg-surface-container text-on-surface hover:bg-primary/10 hover:text-primary'
                  }`}
                  type="button"
                  onClick={() => {
                    setInputVal(String(yr));
                    onEvaluate(yr);
                  }}
                >
                  {yr}
                </button>
              ))}
              <button
                className={`px-space-xs py-1 rounded-full font-body-sm text-body-sm transition-colors ${
                  evaluation.year === 1900
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'bg-surface-container text-on-surface hover:bg-primary/10 hover:text-primary'
                }`}
                type="button"
                onClick={() => {
                  setInputVal('1900');
                  onEvaluate(1900);
                }}
              >
                1900 (Century Non-Leap)
              </button>
              <button
                className={`px-space-xs py-1 rounded-full font-body-sm text-body-sm transition-colors ${
                  evaluation.year === 2000
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'bg-surface-container text-on-surface hover:bg-primary/10 hover:text-primary'
                }`}
                type="button"
                onClick={() => {
                  setInputVal('2000');
                  onEvaluate(2000);
                }}
              >
                2000 (Century Leap)
              </button>
              <button
                className={`px-space-xs py-1 rounded-full font-body-sm text-body-sm transition-colors ${
                  evaluation.year === 2100
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'bg-surface-container text-on-surface hover:bg-primary/10 hover:text-primary'
                }`}
                type="button"
                onClick={() => {
                  setInputVal('2100');
                  onEvaluate(2100);
                }}
              >
                2100
              </button>
              <button
                className={`px-space-xs py-1 rounded-full font-body-sm text-body-sm transition-colors ${
                  evaluation.year === 2400
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'bg-surface-container text-on-surface hover:bg-primary/10 hover:text-primary'
                }`}
                type="button"
                onClick={() => {
                  setInputVal('2400');
                  onEvaluate(2400);
                }}
              >
                2400
              </button>
              <button
                className="px-space-xs py-1 rounded-full bg-secondary-container/20 text-on-secondary-container font-body-sm text-body-sm hover:bg-secondary-container/30 transition-colors flex items-center gap-1 font-medium"
                type="button"
                onClick={onSurpriseMe}
              >
                <span className="material-symbols-outlined text-[14px]">casino</span> Surprise Me
              </button>
            </div>
          </div>

          {/* Big Dynamic Answer Card */}
          <div className="mt-space-xs p-space-md md:p-space-lg rounded-xl bg-surface-container transition-all border border-outline-variant/15" id="primaryResultBox">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors ${
                    evaluation.isLeap
                      ? 'bg-primary text-on-primary'
                      : 'bg-outline text-surface'
                  }`}
                  id="statusIconWrap"
                >
                  <span className="material-symbols-outlined text-[32px]" id="statusIcon">
                    {evaluation.isLeap ? 'check_circle' : 'cancel'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-label-caps text-label-caps uppercase tracking-wider font-bold ${
                      evaluation.isLeap ? 'text-primary' : 'text-outline'
                    }`}
                    id="resultSubHeader"
                  >
                    {evaluation.isLeap ? 'Gregorian Leap Year Confirmed' : 'Standard Calendar Year'}
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold" id="resultTitle">
                    {evaluation.year} is {evaluation.isLeap ? 'a LEAP YEAR ✓' : 'NOT a Leap Year ✕'}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-space-xs self-end md:self-center">
                <button
                  className="p-2 rounded-lg bg-surface-container-lowest hover:bg-primary/10 text-on-surface transition-all flex items-center gap-1 text-body-sm font-medium border border-outline-variant/20 shadow-xs"
                  id="copyResultBtn"
                  title="Copy Calculation Summary"
                  type="button"
                  onClick={handleCopyResult}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copyFeedback ? 'done' : 'content_copy'}
                  </span>
                  <span className="hidden sm:inline">
                    {copyFeedback ? 'Copied with Watermark!' : 'Copy Result'}
                  </span>
                </button>
                <button
                  className="p-2 rounded-lg bg-surface-container-lowest hover:bg-primary/10 text-on-surface transition-all flex items-center gap-1 text-body-sm font-medium border border-outline-variant/20 shadow-xs"
                  id="shareResultBtn"
                  title="Share link"
                  type="button"
                  onClick={handleShare}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {shareFeedback ? 'done' : 'share'}
                  </span>
                  <span className="hidden sm:inline">
                    {shareFeedback ? 'Link Copied!' : 'Share'}
                  </span>
                </button>
                <button
                  className="p-2 rounded-lg bg-surface-container-lowest hover:bg-primary/10 text-on-surface transition-all flex items-center gap-1 text-body-sm font-medium border border-outline-variant/20 shadow-xs"
                  id="printCardBtn"
                  title="Print Snapshot"
                  type="button"
                  onClick={handlePrint}
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                </button>
              </div>
            </div>

            {/* Divisibility & Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm mt-space-md">
              <div className="p-space-sm rounded-lg bg-surface-container-lowest flex flex-col shadow-sm border border-outline-variant/10">
                <span className="font-label-caps text-label-caps text-outline uppercase">February Length</span>
                <span className="font-numerical-display text-[26px] leading-8 text-on-surface font-bold mt-1" id="febDaysMetric">
                  {evaluation.febDays} Days
                </span>
                <span
                  className={`font-body-sm text-body-sm font-medium mt-1 ${
                    evaluation.isLeap ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                  id="febCompMetric"
                >
                  {evaluation.isLeap ? '+1 Extra Calendar Day' : 'Standard common month'}
                </span>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-lowest flex flex-col shadow-sm border border-outline-variant/10">
                <span className="font-label-caps text-label-caps text-outline uppercase">Calendar Year Days</span>
                <span className="font-numerical-display text-[26px] leading-8 text-on-surface font-bold mt-1" id="totalDaysMetric">
                  {evaluation.totalDays} Days
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-1" id="totalHoursMetric">
                  {evaluation.totalHours.toLocaleString()} total hours
                </span>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-lowest flex flex-col shadow-sm border border-outline-variant/10">
                <span className="font-label-caps text-label-caps text-outline uppercase">Gregorian Rule Met</span>
                <span className="font-numerical-display text-[22px] leading-8 text-on-surface font-bold mt-1" id="ruleMetMetric">
                  {evaluation.ruleIndex === 1 && 'Rule 1: ÷ 400'}
                  {evaluation.ruleIndex === 2 && 'Rule 2: ÷ 100'}
                  {evaluation.ruleIndex === 3 && 'Rule 3: ÷ 4'}
                  {evaluation.ruleIndex === 4 && 'Rule 4: Standard'}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-1" id="ruleMetSub">
                  {evaluation.ruleIndex === 1 && 'Century Divisible by 400'}
                  {evaluation.ruleIndex === 2 && 'Century Exception (Common)'}
                  {evaluation.ruleIndex === 3 && 'Divisible by 4, not 100'}
                  {evaluation.ruleIndex === 4 && 'Not divisible by 4'}
                </span>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container-lowest flex flex-col shadow-sm border border-outline-variant/10">
                <span className="font-label-caps text-label-caps text-outline uppercase">Season Alignment</span>
                <span
                  className={`font-numerical-display text-[22px] leading-8 font-bold mt-1 ${
                    evaluation.isLeap ? 'text-primary' : 'text-outline'
                  }`}
                  id="solarDriftMetric"
                >
                  {evaluation.solarDrift}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium mt-1">
                  Keeps spring &amp; autumn on time
                </span>
              </div>
            </div>

            {/* Divisibility Tests Detailed Row */}
            <div className="mt-space-sm p-space-sm rounded-lg bg-surface-container-lowest/90 flex flex-col gap-space-xs border border-outline-variant/10">
              <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
                HOW THIS YEAR IS CHECKED
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs">
                {/* 400 test */}
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low" id="test400Wrap">
                  <span className="font-data-mono text-data-mono text-on-surface">
                    <span>{evaluation.year}</span> ÷ 400
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      evaluation.isDiv400
                        ? 'bg-primary text-on-primary font-bold'
                        : 'bg-surface-container text-outline'
                    }`}
                    id="testBadge400"
                  >
                    {evaluation.isDiv400
                      ? `Exact: ${evaluation.year / 400} ✓`
                      : `Does not divide evenly (Remainder ${evaluation.year % 400})`}
                  </span>
                </div>

                {/* 100 test */}
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low" id="test100Wrap">
                  <span className="font-data-mono text-data-mono text-on-surface">
                    <span>{evaluation.year}</span> ÷ 100
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      evaluation.isDiv100
                        ? 'bg-surface-variant text-on-surface font-semibold'
                        : 'bg-surface-container text-outline'
                    }`}
                    id="testBadge100"
                  >
                    {evaluation.isDiv100
                      ? `Exact: ${evaluation.year / 100} (Century)`
                      : `Does not divide evenly (Remainder ${evaluation.year % 100})`}
                  </span>
                </div>

                {/* 4 test */}
                <div className="flex items-center justify-between p-2 rounded bg-surface-container-low" id="test4Wrap">
                  <span className="font-data-mono text-data-mono text-on-surface">
                    <span>{evaluation.year}</span> ÷ 4
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      evaluation.isDiv4
                        ? 'bg-primary text-on-primary font-bold'
                        : 'bg-surface-container text-outline'
                    }`}
                    id="testBadge4"
                  >
                    {evaluation.isDiv4
                      ? `Divides evenly by 4 without remainder ✓`
                      : `Does not divide evenly (Remainder ${evaluation.year % 4})`}
                  </span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface mt-1" id="calcReasonSummary">
                {evaluation.reason}
              </p>
            </div>

            {/* Neighboring Leap Years Sidecars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-space-sm">
              <div
                className="p-space-sm rounded-lg bg-surface-container-lowest flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors border border-outline-variant/10 shadow-xs"
                id="prevLeapBox"
                onClick={() => {
                  setInputVal(String(evaluation.prevLeap));
                  onEvaluate(evaluation.prevLeap);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">arrow_back</span> Prior Leap Year
                  </span>
                  <span className="font-numerical-display text-[24px] text-on-surface font-bold" id="prevLeapYear">
                    {evaluation.prevLeap}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium" id="prevLeapDiff">
                    {Math.abs(evaluation.year - evaluation.prevLeap)} years prior
                  </span>
                  <div className="text-[11px] text-primary font-semibold">Click to examine →</div>
                </div>
              </div>

              <div
                className="p-space-sm rounded-lg bg-surface-container-lowest flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors border border-outline-variant/10 shadow-xs"
                id="nextLeapBox"
                onClick={() => {
                  setInputVal(String(evaluation.nextLeap));
                  onEvaluate(evaluation.nextLeap);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-outline flex items-center gap-1">
                    Subsequent Leap Year <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                  <span className="font-numerical-display text-[24px] text-on-surface font-bold" id="nextLeapYear">
                    {evaluation.nextLeap}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium" id="nextLeapDiff">
                    in {Math.abs(evaluation.nextLeap - evaluation.year)} years
                  </span>
                  <div className="text-[11px] text-primary font-semibold">Click to examine →</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
