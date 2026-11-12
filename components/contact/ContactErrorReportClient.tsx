'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronDown,
  MessageSquare,
  AlertTriangle,
  Send,
  Lightbulb,
  Check,
  RotateCcw,
  ShieldCheck,
  Link2,
  ArrowRight,
} from 'lucide-react';

interface CalculatorOption {
  name: string;
  url: string;
}

const CALCULATOR_OPTIONS: CalculatorOption[] = [
  {
    name: 'Percentage Calculator',
    url: 'https://solveitcalculator.com/math/percentage-calculator',
  },
  {
    name: 'Percentage Change Calculator',
    url: 'https://solveitcalculator.com/math/percentage-change-calculator',
  },
  {
    name: 'Discount Calculator',
    url: 'https://solveitcalculator.com/math/discount-calculator',
  },
  {
    name: 'Fraction Calculator',
    url: 'https://solveitcalculator.com/math/fraction-calculator',
  },
  {
    name: 'Ratio Calculator',
    url: 'https://solveitcalculator.com/math/ratio-calculator',
  },
  {
    name: 'Average Calculator',
    url: 'https://solveitcalculator.com/math/average-calculator',
  },
  {
    name: 'Scientific Calculator',
    url: 'https://solveitcalculator.com/math/scientific-calculator',
  },
  {
    name: 'Flooring Project Calculator',
    url: 'https://solveitcalculator.com/home-construction/flooring-calculator',
  },
  {
    name: 'Loan Payment Calculator',
    url: 'https://solveitcalculator.com/loan-calculator',
  },
  {
    name: 'Mortgage Calculator',
    url: 'https://solveitcalculator.com/mortgage-calculator',
  },
  {
    name: 'Compound Interest Calculator',
    url: 'https://solveitcalculator.com/compound-interest-calculator',
  },
  {
    name: 'Gross Margin Calculator',
    url: 'https://solveitcalculator.com/finance/margin-calculator',
  },
  {
    name: '401(k) Retirement Calculator',
    url: 'https://solveitcalculator.com/finance/401k-calculator',
  },
  {
    name: 'US Federal Income Tax Calculator',
    url: 'https://solveitcalculator.com/finance/us-federal-income-tax-calculator',
  },
  {
    name: 'Unit Conversion Calculator',
    url: 'https://solveitcalculator.com/conversions',
  },
  {
    name: 'Age Calculator',
    url: 'https://solveitcalculator.com/age-calculator',
  },
  {
    name: 'Date Difference Calculator',
    url: 'https://solveitcalculator.com/date-difference-calculator',
  },
  {
    name: 'Time Duration Calculator',
    url: 'https://solveitcalculator.com/time-duration-calculator',
  },
  {
    name: 'BMI Calculator',
    url: 'https://solveitcalculator.com/bmi-calculator',
  },
  {
    name: 'Other / Not Listed',
    url: 'https://solveitcalculator.com/calculators',
  },
];

const FEEDBACK_SUBJECT_OPTIONS = [
  'General feedback',
  'Suggest a new calculator or conversion tool',
  'Request a feature or improvement',
  'Tell us what you like about the website',
  'Report a typo or content issue',
  'Share ideas to make the site easier to use',
];

const EXAMPLE_TOPICS = [
  'Suggest a new calculator or conversion tool',
  'Request a feature or improvement',
  'Tell us what you like about the website',
  'Report a typo or content issue',
  'Share ideas to make the site easier to use',
];

interface SubmissionSummary {
  type: 'feedback' | 'error';
  heading: string;
  detail: string;
}

export default function ContactErrorReportClient() {
  const confirmationCardRef = useRef<HTMLDivElement>(null);
  const feedbackMessageRef = useRef<HTMLTextAreaElement>(null);

  // Left Column: General Feedback State
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSubject, setFeedbackSubject] = useState('General feedback');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackErrors, setFeedbackErrors] = useState<{
    subject?: string;
    message?: string;
    email?: string;
  }>({});

  // Middle Column: Report Calculation Error State
  const [selectedCalculator, setSelectedCalculator] = useState('');
  const [calculatorUrl, setCalculatorUrl] = useState('');
  const [valuesEntered, setValuesEntered] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [resultAppeared, setResultAppeared] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [errorFormErrors, setErrorFormErrors] = useState<{
    calculator?: string;
    valuesEntered?: string;
    expectedResult?: string;
    resultAppeared?: string;
    email?: string;
  }>({});

  // Right Column: Confirmation Card State
  const [lastSubmission, setLastSubmission] =
    useState<SubmissionSummary | null>(null);

  const isValidEmail = (value: string) => {
    if (!value.trim()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const handleCalculatorSelect = (name: string) => {
    setSelectedCalculator(name);
    if (errorFormErrors.calculator) {
      setErrorFormErrors((prev) => ({ ...prev, calculator: undefined }));
    }
    const matched = CALCULATOR_OPTIONS.find((item) => item.name === name);
    if (matched) {
      setCalculatorUrl(matched.url);
    } else if (!name) {
      setCalculatorUrl('');
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { subject?: string; message?: string; email?: string } =
      {};

    if (!feedbackSubject.trim()) {
      nextErrors.subject = 'Please select a subject for your feedback.';
    }
    if (!feedbackMessage.trim()) {
      nextErrors.message =
        'Please enter your feedback, suggestion, or idea before sending.';
    }
    if (!isValidEmail(feedbackEmail)) {
      nextErrors.email =
        'Please enter a valid email address or leave this field blank.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFeedbackErrors(nextErrors);
      return;
    }

    setFeedbackErrors({});
    setLastSubmission({
      type: 'feedback',
      heading: 'Thank you for your feedback!',
      detail: `Submitted under “${feedbackSubject}”. Your message has been submitted successfully. We appreciate you taking the time to help us make SolveItCalculator better.`,
    });

    if (confirmationCardRef.current) {
      confirmationCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const handleErrorReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: {
      calculator?: string;
      valuesEntered?: string;
      expectedResult?: string;
      resultAppeared?: string;
      email?: string;
    } = {};

    if (!selectedCalculator) {
      nextErrors.calculator =
        'Please choose the calculator where you found the issue.';
    }
    if (!valuesEntered.trim()) {
      nextErrors.valuesEntered =
        'Please enter the exact numbers or units you used.';
    }
    if (!expectedResult.trim()) {
      nextErrors.expectedResult =
        'Please enter the result you expected to see.';
    }
    if (!resultAppeared.trim()) {
      nextErrors.resultAppeared =
        'Please enter the result that appeared on the calculator.';
    }
    if (!isValidEmail(reporterEmail)) {
      nextErrors.email =
        'Please enter a valid email address or leave this field blank.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrorFormErrors(nextErrors);
      return;
    }

    setErrorFormErrors({});
    setLastSubmission({
      type: 'error',
      heading: 'Calculation error report submitted!',
      detail: `Recorded for ${selectedCalculator} (Entered: ${valuesEntered.trim()} · Expected: ${expectedResult.trim()} · Shown: ${resultAppeared.trim()}). Your message has been submitted successfully.`,
    });

    if (confirmationCardRef.current) {
      confirmationCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const handleResetAll = () => {
    setFeedbackName('');
    setFeedbackEmail('');
    setFeedbackSubject('General feedback');
    setFeedbackMessage('');
    setFeedbackErrors({});

    setSelectedCalculator('');
    setCalculatorUrl('');
    setValuesEntered('');
    setExpectedResult('');
    setResultAppeared('');
    setAdditionalDetails('');
    setReporterEmail('');
    setErrorFormErrors({});

    setLastSubmission(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* Top Hero Banner with Breadcrumb, H1 & Right Speech Bubbles + Calculator Illustration */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-b from-[#EAF2FF] via-[#F2F6FF] to-[#F5F7FA] pt-5 pb-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb: Home > Contact */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs sm:text-sm text-[#475569]"
          >
            <Link
              href="/"
              className="text-[#0A58ED] hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
            >
              Home
            </Link>
            <ChevronRight
              className="w-3.5 h-3.5 text-[#94A3B8]"
              aria-hidden="true"
            />
            <span className="font-semibold text-[#0A58ED]" aria-current="page">
              Contact
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Heading + Lead Copy */}
            <div className="max-w-2xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#152238] leading-tight">
                How can we <span className="text-[#0A58ED]">help?</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-[17px] text-[#475569] leading-relaxed">
                We&apos;re always happy to hear from you. You can share
                feedback, suggest a new calculator, or report a calculation
                error. Your input helps us improve SolveItCalculator for
                everyone.
              </p>
            </div>

            {/* Right Clean Illustration: Speech Bubbles + Checklist + Blue Calculator */}
            <div
              aria-hidden="true"
              className="hidden lg:flex items-center justify-end shrink-0 select-none"
            >
              <div className="relative w-[340px] h-[160px] flex items-center justify-center">
                {/* Soft cloud backdrop */}
                <div className="absolute inset-x-4 inset-y-2 rounded-full bg-[#DCE9FF]/75" />

                {/* Left White Checklist Card */}
                <div className="absolute left-7 bottom-3 z-10 w-24 h-20 rounded-xl bg-white/95 border border-[#C7DCFE] shadow-xs p-2.5 -rotate-6 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#93C5FD]" />
                    <span className="h-2 w-12 rounded bg-[#DCE9FF]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#93C5FD]" />
                    <span className="h-2 w-10 rounded bg-[#DCE9FF]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#93C5FD]" />
                    <span className="h-2 w-11 rounded bg-[#DCE9FF]" />
                  </div>
                </div>

                {/* Top Blue Speech Bubble */}
                <div className="relative z-20 -translate-x-8 -translate-y-5 w-28 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-md p-3 -rotate-6 flex flex-col justify-center gap-1.5">
                  <span className="h-2 w-16 rounded-full bg-white/90" />
                  <span className="h-2 w-11 rounded-full bg-white/75" />
                  <span className="absolute -bottom-2 left-5 w-4 h-4 bg-[#1D4ED8] rotate-45 rounded-xs" />
                </div>

                {/* Center Mint-Green Speech Bubble */}
                <div className="relative z-30 -translate-x-2 translate-y-4 w-24 h-14 rounded-2xl bg-gradient-to-br from-[#34D399] to-[#10B981] shadow-md p-3 flex flex-col justify-center gap-1.5">
                  <span className="h-2 w-14 rounded-full bg-white/90" />
                  <span className="h-2 w-9 rounded-full bg-white/75" />
                  <span className="absolute -bottom-1.5 right-5 w-3.5 h-3.5 bg-[#10B981] rotate-45 rounded-xs" />
                </div>

                {/* Right Blue Calculator Card */}
                <div className="relative z-20 translate-x-4 w-24 rounded-2xl bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] p-2.5 shadow-md rotate-6 border border-[#60A5FA]/40">
                  <div className="bg-[#DBEAFE] rounded-md h-4 mb-2" />
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 9 }).map((_, idx) => (
                      <span
                        key={idx}
                        className="h-3 rounded-xs bg-[#EFF6FF]/90"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main 3-Column Layout: General Feedback (4) | Report a Calculation Error (5) | Contextual Sidebar (3) */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================================================================
              COLUMN 1: GENERAL FEEDBACK (4 cols on lg)
          ================================================================ */}
          <section
            aria-labelledby="heading-general-feedback"
            className="lg:col-span-4 bg-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-6 flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start gap-3.5">
                <div
                  aria-hidden="true"
                  className="w-12 h-12 rounded-2xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0"
                >
                  <MessageSquare className="w-6 h-6 fill-[#0A58ED]/15" />
                </div>
                <div>
                  <h2
                    id="heading-general-feedback"
                    className="text-xl font-extrabold text-[#152238]"
                  >
                    General feedback
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                    Share your thoughts, suggestions or ideas.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-[#334155] leading-relaxed">
                Let us know what you like, what can be improved, or suggest a
                new calculator that would be useful.
              </p>

              {/* General Feedback Form */}
              <form
                onSubmit={handleFeedbackSubmit}
                className="mt-5 space-y-4"
                noValidate
              >
                {/* Your name (optional) */}
                <div>
                  <label
                    htmlFor="feedback-name"
                    className="block text-xs sm:text-[13px] font-extrabold text-[#152238] mb-1.5"
                  >
                    Your name (optional)
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white px-3.5 py-2.5 text-sm text-[#152238] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0A58ED] focus:border-[#0A58ED] transition-colors"
                  />
                </div>

                {/* Your email (optional) */}
                <div>
                  <label
                    htmlFor="feedback-email"
                    className="block text-xs sm:text-[13px] font-extrabold text-[#152238] mb-1.5"
                  >
                    Your email (optional)
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    value={feedbackEmail}
                    onChange={(e) => {
                      setFeedbackEmail(e.target.value);
                      if (feedbackErrors.email) {
                        setFeedbackErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                    }}
                    placeholder="Enter your email address"
                    aria-invalid={Boolean(feedbackErrors.email)}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#152238] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                      feedbackErrors.email
                        ? 'border-[#DC2626] bg-[#FEF2F2] focus:ring-[#DC2626]'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] focus:ring-[#0A58ED] focus:border-[#0A58ED]'
                    }`}
                  />
                  {feedbackErrors.email && (
                    <p
                      role="alert"
                      className="mt-1 text-xs font-semibold text-[#DC2626]"
                    >
                      {feedbackErrors.email}
                    </p>
                  )}
                </div>

                {/* Subject * */}
                <div>
                  <label
                    htmlFor="feedback-subject"
                    className="block text-xs sm:text-[13px] font-extrabold text-[#152238] mb-1.5"
                  >
                    Subject <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="feedback-subject"
                      value={feedbackSubject}
                      onChange={(e) => setFeedbackSubject(e.target.value)}
                      aria-required="true"
                      className="w-full appearance-none rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white pl-3.5 pr-9 py-2.5 text-sm font-medium text-[#152238] focus:outline-none focus:ring-2 focus:ring-[#0A58ED] focus:border-[#0A58ED] cursor-pointer transition-colors"
                    >
                      {FEEDBACK_SUBJECT_OPTIONS.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="w-4 h-4 text-[#475569] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Message * */}
                <div>
                  <label
                    htmlFor="feedback-message"
                    className="block text-xs sm:text-[13px] font-extrabold text-[#152238] mb-1.5"
                  >
                    Message <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      ref={feedbackMessageRef}
                      id="feedback-message"
                      rows={5}
                      maxLength={1000}
                      value={feedbackMessage}
                      onChange={(e) => {
                        setFeedbackMessage(e.target.value);
                        if (feedbackErrors.message) {
                          setFeedbackErrors((prev) => ({
                            ...prev,
                            message: undefined,
                          }));
                        }
                      }}
                      placeholder={
                        'Tell us your feedback, suggestion or idea...\nBe as detailed as you like.'
                      }
                      aria-required="true"
                      aria-invalid={Boolean(feedbackErrors.message)}
                      className={`w-full rounded-lg border p-3.5 pb-7 text-sm text-[#152238] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 transition-colors resize-y ${
                        feedbackErrors.message
                          ? 'border-[#DC2626] bg-[#FEF2F2] focus:ring-[#DC2626]'
                          : 'border-[#CBD5E1] bg-[#F8FAFC] focus:ring-[#0A58ED] focus:border-[#0A58ED]'
                      }`}
                    />
                    <span
                      aria-live="polite"
                      className="absolute right-3 bottom-2.5 text-[11px] font-medium text-[#64748B] tabular-nums select-none"
                    >
                      {feedbackMessage.length} / 1000
                    </span>
                  </div>
                  {feedbackErrors.message && (
                    <p
                      role="alert"
                      className="mt-1 text-xs font-semibold text-[#DC2626]"
                    >
                      {feedbackErrors.message}
                    </p>
                  )}
                </div>

                {/* Send feedback Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-[#0A58ED] hover:bg-[#1D47B0] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A58ED]"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Send feedback</span>
                </button>
              </form>
            </div>

            {/* Example topics you can share */}
            <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
              <h3 className="text-xs sm:text-[13px] font-extrabold text-[#152238] mb-2.5">
                Example topics you can share
              </h3>
              <ul className="space-y-2 text-xs text-[#475569]">
                {EXAMPLE_TOPICS.map((topic) => (
                  <li key={topic} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-[#0A58ED] mt-1.5 shrink-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackSubject(topic);
                        feedbackMessageRef.current?.focus();
                      }}
                      className="text-left hover:text-[#0A58ED] hover:underline transition-colors cursor-pointer"
                    >
                      {topic}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ================================================================
              COLUMN 2: REPORT A CALCULATION ERROR (5 cols on lg)
          ================================================================ */}
          <section
            aria-labelledby="heading-report-error"
            className="lg:col-span-5 bg-gradient-to-b from-[#FFF9F9] via-white to-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-6"
          >
            {/* Card Header */}
            <div className="flex items-start gap-3.5">
              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0"
              >
                <AlertTriangle className="w-6 h-6 fill-[#DC2626] text-white" />
              </div>
              <div>
                <h2
                  id="heading-report-error"
                  className="text-xl font-extrabold text-[#152238]"
                >
                  Report a calculation error
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                  Help us fix incorrect results or issues.
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-[#334155] leading-relaxed">
              If you think a calculator is giving the wrong result or has a
              problem, please provide as much detail as possible. This helps us
              reproduce the issue and fix it quickly.
            </p>

            {/* Error Report Form */}
            <form
              onSubmit={handleErrorReportSubmit}
              className="mt-5 space-y-4"
              noValidate
            >
              {/* Calculator name * */}
              <div>
                <label
                  htmlFor="error-calc-name"
                  className="block text-xs sm:text-[13px] font-extrabold text-[#152238] mb-1.5"
                >
                  Calculator name <span className="text-[#DC2626]">*</span>
                </label>
                <div className="relative">
                  <select
                    id="error-calc-name"
                    value={selectedCalculator}
                    onChange={(e) => handleCalculatorSelect(e.target.value)}
                    aria-required="true"
                    aria-invalid={Boolean(errorFormErrors.calculator)}
                    aria-describedby="helper-calc-name"
                    className={`w-full appearance-none rounded-lg border pl-3.5 pr-9 py-2.5 text-sm font-medium text-[#152238] focus:bg-white focus:outline-none focus:ring-2 cursor-pointer transition-colors ${
                      errorFormErrors.calculator
                        ? 'border-[#DC2626] bg-[#FEF2F2] focus:ring-[#DC2626]'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] focus:ring-[#0A58ED] focus:border-[#0A58ED]'
                    }`}
                  >
                    <option value="">Select a calculator</option>
                    {CALCULATOR_OPTIONS.map((calc) => (
                      <option key={calc.name} value={calc.name}>
                        {calc.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="w-4 h-4 text-[#475569] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
                <p
                  id="helper-calc-name"
                  className="mt-1 text-[11px] text-[#64748B]"
                >
                  Choose the calculator where you found the issue.
                </p>
                {errorFormErrors.calculator && (
                  <p
                    role="alert"
                    className="mt-1 text-xs font-semibold text-[#DC2626]"
                  >
                    {errorFormErrors.calculator}
                  </p>
                )}
              </div>

              {/* Calculator URL (optional) */}
              <div>
                <label
                  htmlFor="error-calc-url"
                  className="block text-xs sm:text-[13px] font-extrabold text-[#152238] mb-1.5"
                >
                  Calculator URL (optional)
                </label>
                <input
                  id="error-calc-url"
                  type="url"
                  value={calculatorUrl}
                  onChange={(e) => setCalculatorUrl(e.target.value)}
                  placeholder="https://solveitcalculator.com/..."
                  aria-describedby="helper-calc-url"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white px-3.5 py-2.5 text-sm text-[#152238] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0A58ED] focus:border-[#0A58ED] transition-colors"
                />
                <p
                  id="helper-calc-url"
                  className="mt-1 text-[11px] text-[#64748B]"
                >
                  If possible, paste the full page URL of the calculator.
                </p>
              </div>

              {/* 2-Column Side-by-Side Row: What values did you enter? * | What result did you expect? * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="error-values-entered"
                    className="block text-xs sm:text-[13px] font-extrabold text-[#152238] mb-1.5"
                  >
                    What values did you enter?{' '}
                    <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    id="error-values-entered"
                    type="text"
                    value={valuesEntered}
                    onChange={(e) => {
                      setValuesEntered(e.target.value);
                      if (errorFormErrors.valuesEntered) {
                        setErrorFormErrors((prev) => ({
                          ...prev,
                          valuesEntered: undefined,
                        }));
                      }
                    }}
                    placeholder="e.g. 15 and 250"
                    aria-required="true"
                    aria-invalid={Boolean(errorFormErrors.valuesEntered)}
                    aria-describedby="helper-values-entered"
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#152238] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                      errorFormErrors.valuesEntered
                        ? 'border-[#DC2626] bg-[#FEF2F2] focus:ring-[#DC2626]'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] focus:ring-[#0A58ED] focus:border-[#0A58ED]'
                    }`}
                  />
                  <p
                    id="helper-values-entered"
                    className="mt-1 text-[11px] text-[#64748B] leading-snug"
                  >
                    Enter the exact numbers, units or options you used.
                  </p>
                  {errorFormErrors.valuesEntered && (
                    <p
                      role="alert"
                      className="mt-1 text-xs font-semibold text-[#DC2626]"
                    >
                      {errorFormErrors.valuesEntered}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="error-expected-result"
                    className="block text-xs sm:text-[13px] font-extrabold text-[#152238] mb-1.5"
                  >
                    What result did you expect?{' '}
                    <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    id="error-expected-result"
                    type="text"
                    value={expectedResult}
                    onChange={(e) => {
                      setExpectedResult(e.target.value);
                      if (errorFormErrors.expectedResult) {
                        setErrorFormErrors((prev) => ({
                          ...prev,
                          expectedResult: undefined,
                        }));
                      }
                    }}
                    placeholder="e.g. 37.5"
                    aria-required="true"
                    aria-invalid={Boolean(errorFormErrors.expectedResult)}
                    aria-describedby="helper-expected-result"
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#152238] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                      errorFormErrors.expectedResult
                        ? 'border-[#DC2626] bg-[#FEF2F2] focus:ring-[#DC2626]'
                        : 'border-[#CBD5E1] bg-[#F8FAFC] focus:ring-[#0A58ED] focus:border-[#0A58ED]'
                    }`}
                  />
                  <p
                    id="helper-expected-result"
                    className="mt-1 text-[11px] text-[#64748B] leading-snug"
                  >
                    Enter the result you believe is correct.
                  </p>
                  {errorFormErrors.expectedResult && (
                    <p
                      role="alert"
                      className="mt-1 text-xs font-semibold text-[#DC2626]"
                    >
                      {errorFormErrors.expectedResult}
                    </p>
                  )}
                </div>
              </div>

              {/* What result appeared? * */}
              <div>
                <label
                  htmlFor="error-result-appeared"
                  className="block text-xs sm:text-[13px] font-extrabold text-[#152238] mb-1.5"
                >
                  What result appeared?{' '}
                  <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="error-result-appeared"
                  type="text"
                  value={resultAppeared}
                  onChange={(e) => {
                    setResultAppeared(e.target.value);
                    if (errorFormErrors.resultAppeared) {
                      setErrorFormErrors((prev) => ({
                        ...prev,
                        resultAppeared: undefined,
                      }));
                    }
                  }}
                  placeholder="e.g. 375"
                  aria-required="true"
                  aria-invalid={Boolean(errorFormErrors.resultAppeared)}
                  aria-describedby="helper-result-appeared"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#152238] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                    errorFormErrors.resultAppeared
                      ? 'border-[#DC2626] bg-[#FEF2F2] focus:ring-[#DC2626]'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] focus:ring-[#0A58ED] focus:border-[#0A58ED]'
                  }`}
                />
                <p
                  id="helper-result-appeared"
                  className="mt-1 text-[11px] text-[#64748B]"
                >
                  Enter the exact shown on the calculator.
                </p>
                {errorFormErrors.resultAppeared && (
                  <p
                    role="alert"
                    className="mt-1 text-xs font-semibold text-[#DC2626]"
                  >
                    {errorFormErrors.resultAppeared}
                  </p>
                )}
              </div>

              {/* Additional details (optional) */}
              <div>
                <label
                  htmlFor="error-additional-details"
                  className="block text-xs sm:text-[13px] font-extrabold text-[#152238] mb-1.5"
                >
                  Additional details (optional)
                </label>
                <div className="relative">
                  <textarea
                    id="error-additional-details"
                    rows={4}
                    maxLength={1000}
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Please share any other information that might help us understand the issue, such as screenshots, steps to reproduce or device/browser details."
                    className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white p-3.5 pb-7 text-sm text-[#152238] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0A58ED] focus:border-[#0A58ED] transition-colors resize-y"
                  />
                  <span
                    aria-live="polite"
                    className="absolute right-3 bottom-2.5 text-[11px] font-medium text-[#64748B] tabular-nums select-none"
                  >
                    {additionalDetails.length} / 1000
                  </span>
                </div>
              </div>

              {/* Your email (optional) */}
              <div>
                <label
                  htmlFor="error-reporter-email"
                  className="block text-xs sm:text-[13px] font-extrabold text-[#152238] mb-1.5"
                >
                  Your email (optional)
                </label>
                <input
                  id="error-reporter-email"
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => {
                    setReporterEmail(e.target.value);
                    if (errorFormErrors.email) {
                      setErrorFormErrors((prev) => ({
                        ...prev,
                        email: undefined,
                      }));
                    }
                  }}
                  placeholder="Enter your email address"
                  aria-invalid={Boolean(errorFormErrors.email)}
                  aria-describedby="helper-reporter-email"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#152238] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 transition-colors ${
                    errorFormErrors.email
                      ? 'border-[#DC2626] bg-[#FEF2F2] focus:ring-[#DC2626]'
                      : 'border-[#CBD5E1] bg-[#F8FAFC] focus:ring-[#0A58ED] focus:border-[#0A58ED]'
                  }`}
                />
                <p
                  id="helper-reporter-email"
                  className="mt-1 text-[11px] text-[#64748B]"
                >
                  We may contact you for more information if needed.
                </p>
                {errorFormErrors.email && (
                  <p
                    role="alert"
                    className="mt-1 text-xs font-semibold text-[#DC2626]"
                  >
                    {errorFormErrors.email}
                  </p>
                )}
              </div>

              {/* Submit report Button */}
              <button
                type="submit"
                className="w-full py-3 px-5 rounded-xl bg-[#0A58ED] hover:bg-[#1D47B0] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0A58ED]"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Submit report</span>
              </button>
            </form>
          </section>

          {/* ================================================================
              COLUMN 3: CONTEXTUAL HELP, CONFIRMATION STATE & PRIVACY (3 cols)
          ================================================================ */}
          <aside
            aria-label="Helpful resources and confirmation status"
            className="lg:col-span-3 space-y-5"
          >
            {/* Card 1: Before you contact us */}
            <div className="bg-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-5 space-y-3.5">
              <div className="flex items-start gap-3">
                <div
                  aria-hidden="true"
                  className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0"
                >
                  <Lightbulb className="w-5 h-5 text-[#0A58ED] fill-[#FACC15]" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#152238]">
                    Before you contact us
                  </h2>
                  <p className="mt-1 text-xs text-[#475569] leading-relaxed">
                    You may find the answer in our guides or help pages.
                  </p>
                </div>
              </div>

              <ul className="divide-y divide-[#F1F5F9] text-xs sm:text-[13px]">
                {[
                  {
                    label: 'How to use our calculators',
                    href: '/about#heading-how-calculators-work',
                  },
                  {
                    label: 'Calculation methodology',
                    href: '/calculation-methodology',
                  },
                  {
                    label: 'Browse all calculators',
                    href: '/calculators',
                  },
                  {
                    label: 'Frequently asked questions',
                    href: '/guides/how-to-calculate-a-percentage#faqs',
                  },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="py-2.5 flex items-center justify-between gap-2 font-semibold text-[#0A58ED] hover:text-[#1D47B0] group"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-[#0A58ED] shrink-0"
                        />
                        <span className="group-hover:underline">
                          {item.label}
                        </span>
                      </span>
                      <ChevronRight
                        className="w-4 h-4 text-[#0A58ED] group-hover:translate-x-0.5 transition-transform shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2: Message submitted (Confirmation State Card) */}
            <div
              ref={confirmationCardRef}
              role="status"
              aria-live="polite"
              className={`rounded-2xl border p-5 shadow-2xs space-y-3.5 transition-all ${
                lastSubmission
                  ? 'bg-[#E9F9F1] border-[#16856B] ring-2 ring-[#16856B]/25'
                  : 'bg-[#F1FBF6] border-[#CBECE0]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="w-9 h-9 rounded-full bg-[#16856B] text-white flex items-center justify-center shrink-0 shadow-2xs"
                >
                  <Check className="w-5 h-5 stroke-[2.75]" />
                </div>
                <h2 className="text-base font-extrabold text-[#152238]">
                  Message submitted
                </h2>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs sm:text-[13px] font-extrabold text-[#152238]">
                  {lastSubmission
                    ? lastSubmission.heading
                    : 'Thank you for your feedback!'}
                </p>
                <p className="text-xs text-[#334155] leading-relaxed">
                  {lastSubmission
                    ? lastSubmission.detail
                    : 'Your message has been submitted successfully. We appreciate you taking the time to help us make SolveItCalculator better.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetAll}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#EAF2FF] border border-[#93C5FD] text-[#0A58ED] font-bold text-xs sm:text-[13px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A58ED]"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Send another message</span>
              </button>
            </div>

            {/* Card 3: Your privacy */}
            <div className="bg-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-5 flex items-start gap-3.5">
              <div
                aria-hidden="true"
                className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0 mt-0.5"
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-base font-extrabold text-[#152238]">
                  Your privacy
                </h2>
                <p className="text-xs text-[#475569] leading-relaxed">
                  The information you share with us is used only to review your
                  feedback, fix issues and improve our calculators. We do not
                  use it for marketing purposes.
                </p>
                <div className="pt-0.5">
                  <Link
                    href="/privacy-policy"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A58ED] hover:underline"
                  >
                    <span>Read our Privacy Policy</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 4: Related pages */}
            <div className="bg-white rounded-2xl border border-[#DCE5F2] shadow-2xs p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="w-10 h-10 rounded-xl bg-[#EAF2FF] text-[#0A58ED] flex items-center justify-center shrink-0"
                >
                  <Link2 className="w-5 h-5" />
                </div>
                <h2 className="text-base font-extrabold text-[#152238]">
                  Related pages
                </h2>
              </div>

              <ul className="space-y-2 text-xs sm:text-[13px] pl-1">
                <li className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[#0A58ED]"
                  />
                  <Link
                    href="/about"
                    className="font-semibold text-[#0A58ED] hover:underline"
                  >
                    About SolveItCalculator
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
                </li>
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
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
