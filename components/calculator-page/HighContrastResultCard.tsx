'use client';

import React, { useState, useCallback } from 'react';
import { Calculator, Check, Copy, Share2, Printer, Coins } from 'lucide-react';

export interface HighContrastResultCardProps {
  id?: string;
  hasValidResult: boolean;
  promptSummary?: string;
  promptSuffix?: string;
  mainValue?: string;
  equation?: string;
  fallbackFormula?: string;
  secondaryNote?: string;
  placeholderMessage?: string;
  copyText?: string;
  onCopyResult?: () => void;
  copiedExternal?: boolean;
  onShareLink?: () => void;
  linkCopiedExternal?: boolean;
  onPrint?: () => void;
  showPrint?: boolean;
  currencyBadgeText?: string;
}

export default function HighContrastResultCard({
  id = 'live-result-card',
  hasValidResult,
  promptSummary,
  promptSuffix = 'is:',
  mainValue,
  equation,
  fallbackFormula,
  secondaryNote,
  placeholderMessage,
  copyText,
  onCopyResult,
  copiedExternal,
  onShareLink,
  linkCopiedExternal,
  onPrint,
  showPrint = false,
  currencyBadgeText,
}: HighContrastResultCardProps) {
  const [internalCopied, setInternalCopied] = useState(false);

  const isCopied = copiedExternal ?? internalCopied;

  const handleCopy = useCallback(async () => {
    if (!hasValidResult) return;
    if (onCopyResult) {
      onCopyResult();
      return;
    }

    const textToCopy =
      copyText ||
      [
        promptSummary ? `${promptSummary} ${promptSuffix} ${mainValue}` : mainValue,
        equation ? `Formula: ${equation}` : '',
      ]
        .filter(Boolean)
        .join('\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setInternalCopied(true);
      window.setTimeout(() => setInternalCopied(false), 2000);
    } catch {
      // Ignore clipboard permission errors in restricted contexts
    }
  }, [hasValidResult, onCopyResult, copyText, promptSummary, promptSuffix, mainValue, equation]);

  return (
    <section
      id={id}
      role="status"
      aria-live="polite"
      aria-label="Your calculation result"
      className="calc-result-card scroll-mt-24 rounded-2xl bg-gradient-to-br from-[#EFF6FF] via-white to-[#F8FAFC] dark:bg-none dark:bg-[#0f172a] text-[#0F172A] dark:text-white border border-[#93C5FD] dark:border-[#1e293b] p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4"
    >
      {/* Top Row: Label + Action Controls */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            aria-hidden="true"
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              hasValidResult
                ? 'bg-[#DCFCE7] text-[#047857] border border-[#86EFAC] dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-400/30'
                : 'bg-[#DBEAFE] text-[#2457D6] border border-[#93C5FD] dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            {hasValidResult ? (
              <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            ) : (
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="text-xs font-bold tracking-wide text-[#2457D6] dark:text-slate-300">
              {hasValidResult ? 'Calculated result' : 'Ready to calculate'}
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A] dark:text-white leading-snug">
              {hasValidResult && promptSummary ? (
                <>
                  <span>{promptSummary}</span>{' '}
                  <span className="font-semibold text-[#475569] dark:text-slate-300">
                    {promptSuffix}
                  </span>
                </>
              ) : (
                'Your result'
              )}
            </h2>
            {!hasValidResult && (
              <p className="text-sm text-[#475569] dark:text-slate-300 mt-0.5 leading-relaxed">
                {placeholderMessage ||
                  'Enter values in the calculator inputs above to compute your result.'}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons (>= 44x44px touch targets) */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={!hasValidResult}
            onClick={handleCopy}
            className="calc-copy-btn min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2457D6] hover:bg-[#1D4ED8] text-white dark:bg-white dark:text-[#0f172a] dark:hover:bg-slate-100 active:scale-[0.98] disabled:bg-[#E2E8F0] disabled:text-[#64748B] disabled:border disabled:border-[#CBD5E1] dark:disabled:bg-slate-700 dark:disabled:text-slate-400 dark:disabled:border-slate-600 disabled:cursor-not-allowed text-sm font-bold shadow-xs transition-[background-color,transform] duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] dark:focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0f172a]"
          >
            {isCopied ? (
              <>
                <Check
                  className="w-4 h-4 text-emerald-200 dark:text-emerald-700 shrink-0"
                  aria-hidden="true"
                />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Copy result</span>
              </>
            )}
          </button>

          {onShareLink && (
            <button
              type="button"
              onClick={onShareLink}
              aria-label="Share calculator link"
              className="calc-secondary-btn min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#152238] dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/15 dark:text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] dark:focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0f172a]"
            >
              {linkCopiedExternal ? (
                <>
                  <Check
                    className="w-4 h-4 text-[#047857] dark:text-emerald-300 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-[#047857] dark:text-emerald-200">
                    Link copied
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#2457D6] dark:text-white shrink-0" aria-hidden="true" />
                  <span>Share</span>
                </>
              )}
            </button>
          )}

          {showPrint && onPrint && (
            <button
              type="button"
              onClick={onPrint}
              aria-label="Print calculation result"
              className="calc-secondary-btn min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#152238] dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/15 dark:text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] dark:focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0f172a]"
            >
              <Printer className="w-4 h-4 text-[#2457D6] dark:text-white shrink-0" aria-hidden="true" />
              <span>Print</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Large 28px–32px Numerical Result */}
      <div className="min-h-[44px] space-y-1">
        {hasValidResult && mainValue ? (
          <>
            <div className="calc-result-value text-[28px] sm:text-[32px] leading-[1.15] font-extrabold text-[#0F172A] dark:text-white tracking-tight tabular-nums break-words">
              {mainValue}
            </div>
            {secondaryNote && (
              <p className="text-sm font-medium text-[#334155] dark:text-slate-300 leading-relaxed pt-0.5">
                {secondaryNote}
              </p>
            )}
          </>
        ) : (
          <>
            <div
              aria-hidden="true"
              className="calc-result-value text-[28px] sm:text-[32px] leading-[1.15] font-extrabold text-[#64748B] dark:text-slate-400 tracking-tight tabular-nums select-none"
            >
              —
            </div>
            <p className="text-sm text-[#475569] dark:text-slate-400">
              Calculated output updates here as soon as you enter values above.
            </p>
          </>
        )}
      </div>

      {/* Transparent Formula & Live Equation Strip */}
      {(equation || fallbackFormula) && (
        <div className="calc-result-formula rounded-xl bg-white dark:bg-white/[0.07] border border-[#BFDBFE] dark:border-white/15 px-3.5 py-2.5 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#2457D6] dark:text-slate-300">
              {hasValidResult ? 'Formula & live calculation' : 'Formula'}
            </span>
            {currencyBadgeText && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#047857] dark:text-sky-300">
                <Coins className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{currencyBadgeText}</span>
              </span>
            )}
          </div>
          <div className="text-sm font-semibold font-mono text-[#0F172A] dark:text-white tracking-wide tabular-nums break-words">
            {hasValidResult && equation ? equation : fallbackFormula}
          </div>
        </div>
      )}
    </section>
  );
}
