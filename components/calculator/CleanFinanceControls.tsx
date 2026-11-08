'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Calendar, ExternalLink, ArrowUpRight } from 'lucide-react';

export function formatMoney(val: number, currency = 'USD', decimals = 0): string {
  if (!Number.isFinite(val)) return '$0';
  const locale = currency === 'INR' ? 'en-IN' : currency === 'GBP' ? 'en-GB' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
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
  const clamped = Math.min(Math.max(value, min), max);
  const pct = max > min ? Math.max(0, Math.min(100, ((clamped - min) / (max - min)) * 100)) : 0;

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
          <span>{minLabel}</span>
          <span>{midLabel}</span>
          <span>{maxLabel}</span>
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
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
        <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>
           Statutory Data Source: <strong>{authority}</strong> ({document})
        </span>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-[var(--muted)] font-mono">
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
  return (
    <div className="pt-4 border-t border-[var(--border)]">
      <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">
        Related Financial Engines
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
