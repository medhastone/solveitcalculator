'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Calendar,
  ExternalLink,
  ArrowUpRight,
  Coins,
} from 'lucide-react';
import {
  formatWithGlobalCurrency,
  formatExchangeRate,
  useCurrency,
  GLOBAL_CURRENCIES,
} from '@/lib/currency';

export function formatMoney(
  val: number,
  sourceCurrency = 'USD',
  decimals = 0
): string {
  return formatWithGlobalCurrency(val, {
    fromCurrency: sourceCurrency,
    decimals,
  });
}

export function formatPct(val: number, decimals = 1): string {
  if (!Number.isFinite(val)) return '0.0%';
  return `${val.toFixed(decimals)}%`;
}

export function UnboxedSlider({
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  midLabel,
  maxLabel,
  ariaLabel,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  minLabel?: string;
  midLabel?: string;
  maxLabel?: string;
  ariaLabel: string;
}) {
  // Subscribe slider labels and parent tree to global currency updates
  const { symbol } = useCurrency();
  const clamped = Math.min(Math.max(value, min), max);
  const pct =
    max > min ? Math.max(0, Math.min(100, ((clamped - min) / (max - min)) * 100)) : 0;

  const adaptLabel = (lbl?: string) => {
    if (!lbl) return lbl;
    return lbl.replace(/^(CA\$|AU\$|A\$|SG\$|S\$|AED\s*|[$€£₹])/, symbol);
  };

  return (
    <div className="space-y-1.5 w-full pt-1">
      <input
        type="range"
        aria-label={ariaLabel}
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${pct}%, rgba(148, 163, 184, 0.35) ${pct}%, rgba(148, 163, 184, 0.35) 100%)`,
        }}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-600"
      />
      {(minLabel || midLabel || maxLabel) && (
        <div className="flex justify-between text-[11px] font-medium text-[var(--muted)] select-none tabular-nums">
          <span>{adaptLabel(minLabel)}</span>
          <span>{adaptLabel(midLabel)}</span>
          <span>{adaptLabel(maxLabel)}</span>
        </div>
      )}
    </div>
  );
}

export function VerifiedSourceBadge({
  authority,
  document,
  verifiedDate,
  url,
}: {
  authority: string;
  document: string;
  verifiedDate: string;
  url?: string;
}) {
  const { currency, symbol, rates, applyExchangeRate, setCurrency } =
    useCurrency();
  const activeRate = rates[currency] ?? 1.0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
      <div className="flex flex-wrap items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>
          Statutory Data Source: <strong>{authority}</strong> ({document})
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--muted)] font-mono">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 font-sans font-bold">
          <Coins className="w-3 h-3" />
          <span>
            {currency} ({symbol}) ·{' '}
            {applyExchangeRate
              ? `1 USD = ${symbol}${formatExchangeRate(currency, activeRate)}`
              : `1:1 Nominal`}
          </span>
        </span>
        <div className="inline-flex items-center gap-1">
          {GLOBAL_CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(c.code)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-bold transition cursor-pointer ${
                currency === c.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/70'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Verified: {verifiedDate}
        </span>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-sans font-semibold"
          >
            Official Schedule <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export function RelatedCalculatorsStrip({
  links,
}: {
  links: { title: string; path: string; desc: string }[];
}) {
  const { currency, symbol, rates, applyExchangeRate } = useCurrency();
  const activeRate = rates[currency] ?? 1.0;

  return (
    <div className="pt-4 border-t border-[var(--border)] space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          Related Financial Engines
        </div>
        <div className="text-[11px] font-semibold text-[var(--muted)]">
          Active Currency: <strong className="text-[var(--text)]">{currency} ({symbol})</strong>{' '}
          {applyExchangeRate
            ? `· Live FX Rate: 1 USD = ${symbol}${formatExchangeRate(currency, activeRate)}`
            : `· 1:1 Symbol Mode`}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {links.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="group p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-blue-500/50 transition flex flex-col justify-between gap-1"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-[var(--text)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {item.title}
              </span>
              <ArrowUpRight className="w-4 h-4 text-[var(--muted)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition shrink-0" />
            </div>
            <p className="text-xs text-[var(--muted)] line-clamp-2">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
