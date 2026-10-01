import React from 'react';
import Link from 'next/link';

interface HeaderSectionProps {
  onPrint: () => void;
  onExportCSV: () => void;
  onCopyPlan: () => void;
  copied: boolean;
}

export default function HeaderSection({
  onPrint,
  onExportCSV,
  onCopyPlan,
  copied,
}: HeaderSectionProps) {
  return (
    <header className="w-full border-b border-surface-container bg-surface print:hidden">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-md">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant mb-space-xs">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-outline-variant select-none">&gt;</span>
          <Link href="/time-date" className="hover:text-primary transition-colors">
            Time &amp; Date
          </Link>
          <span className="text-outline-variant select-none">&gt;</span>
          <span className="text-on-surface font-medium" aria-current="page">
            Running Pace &amp; Lap Split Calculator
          </span>
        </nav>

        {/* Title & Actions Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm">
          <div>
            <div className="flex items-center gap-space-xs">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Running Pace &amp; Lap Split Calculator
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
                Pro
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
              Precision metrological pacing engine for calculating pace, finish times, distances,
              splits, and physiological training zones with zero drift.
            </p>
          </div>

          <div className="flex items-center gap-space-xs shrink-0">
            <button
              type="button"
              id="btnCopyPlan"
              onClick={onCopyPlan}
              title="Copy running pacing plan with Solveitcalculator.com watermark"
              className="px-space-sm py-space-xs rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container font-body-sm text-body-sm font-medium transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied with Watermark!' : 'Copy Plan'}</span>
            </button>
            <button
              type="button"
              id="btnPrintSheet"
              onClick={onPrint}
              title="Print race-day wristband with Solveitcalculator.com watermark"
              className="px-space-sm py-space-xs rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container font-body-sm text-body-sm font-medium transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print Wristband</span>
            </button>
            <button
              type="button"
              id="btnExportCSV"
              onClick={onExportCSV}
              className="px-space-sm py-space-xs rounded-lg bg-primary text-on-primary hover:bg-primary/90 font-body-sm text-body-sm font-medium transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
