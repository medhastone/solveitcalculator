'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ExternalLink,
  ArrowUpRight,
  Calculator,
  Coins,
} from 'lucide-react';
import type { VerifiedSourceMeta } from '@/lib/finance-core/tax-payroll-business-data';
import {
  formatWithGlobalCurrency,
  formatExchangeRate,
  useCurrency,
  GLOBAL_CURRENCIES,
} from '@/lib/currency';

export function formatMoney(val: number, symbol = '$', decimals = 0): string {
  return formatWithGlobalCurrency(val, {
    fromCurrency: symbol,
    decimals,
  });
}

export function formatIndianRupees(val: number, decimals = 0): string {
  return formatWithGlobalCurrency(val, {
    fromCurrency: 'INR',
    decimals,
  });
}

export function SuiteSlider({
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
  const { symbol } = useCurrency();
  const clamped = Math.min(Math.max(value, min), max);
  const pct = max > min ? ((clamped - min) / (max - min)) * 100 : 0;

  const adaptLabel = (lbl?: string) => {
    if (!lbl) return lbl;
    return lbl.replace(/^(CA\$|AU\$|A\$|SG\$|S\$|AED\s*|[$€£₹])/, symbol);
  };

  return (
    <div className="w-full space-y-1 pt-1">
      <input
        type="range"
        aria-label={ariaLabel}
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, var(--primary, #2563eb) 0%, var(--primary, #2563eb) ${pct}%, var(--color-surface-container-highest, #cbd5e1) ${pct}%, var(--color-surface-container-highest, #cbd5e1) 100%)`,
        }}
        className="thin-slider w-full cursor-pointer"
      />
      {(minLabel || midLabel || maxLabel) && (
        <div className="flex justify-between text-[11px] font-medium text-on-surface-variant/80 font-mono tabular-nums">
          <span>{adaptLabel(minLabel)}</span>
          <span>{adaptLabel(midLabel)}</span>
          <span>{adaptLabel(maxLabel)}</span>
        </div>
      )}
    </div>
  );
}

export function VerifiedAuthorityBanner({ source }: { source: VerifiedSourceMeta }) {
  const { currency, symbol, rates, applyExchangeRate, setCurrency } =
    useCurrency();
  const activeRate = rates[currency] ?? 1.0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2.5 px-4 rounded-xl bg-surface-container border border-outline-variant/50 text-xs text-on-surface-variant">
      <div className="flex flex-wrap items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span className="font-semibold text-on-surface">{source.authority}</span>
        <span aria-hidden="true">·</span>
        <span>{source.document}</span>
        <span aria-hidden="true">·</span>
        <span className="font-mono text-on-surface">Tax Year: {source.taxYear}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 font-bold">
          <Coins className="w-3 h-3" />
          <span>
            {currency} ({symbol}) ·{' '}
            {applyExchangeRate
              ? `1 USD = ${symbol}${formatExchangeRate(currency, activeRate)}`
              : '1:1 Nominal'}
          </span>
        </span>
        <div className="inline-flex items-center gap-1">
          {GLOBAL_CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrency(c.code)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                currency === c.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300/70'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
        <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
          Last updated: {source.dateVerified}
        </span>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
        >
          <span>Official Schedule</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

export function RelatedCalculatorsGrid({
  items,
}: {
  items: { title: string; description: string; href: string }[];
}) {
  const { currency, symbol, rates, applyExchangeRate } = useCurrency();
  const activeRate = rates[currency] ?? 1.0;

  return (
    <section className="pt-8 border-t border-outline-variant/40 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-on-surface">
            Related Financial Calculators
          </h2>
        </div>
        <div className="text-xs font-semibold text-on-surface-variant">
          Active Currency: <strong className="text-on-surface">{currency} ({symbol})</strong>{' '}
          {applyExchangeRate
            ? `· Live FX Rate: 1 USD = ${symbol}${formatExchangeRate(currency, activeRate)}`
            : '· 1:1 Symbol Mode'}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 hover:border-primary transition-all flex flex-col justify-between gap-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{item.description}</p>
            </div>
            <span className="text-xs font-semibold text-primary">Open Calculator →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
