'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, ArrowUpRight, Calculator } from 'lucide-react';
import type { VerifiedSourceMeta } from '@/lib/finance-core/tax-payroll-business-data';

export function formatMoney(val: number, symbol = '$', decimals = 0): string {
  if (!Number.isFinite(val)) return `${symbol}0`;
  const isNeg = val < 0;
  const abs = Math.abs(val);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${isNeg ? '-' : ''}${symbol}${formatted}`;
}

export function formatIndianRupees(val: number, decimals = 0): string {
  if (!Number.isFinite(val)) return '₹0';
  const isNeg = val < 0;
  const abs = Math.abs(val);
  const formatted = abs.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${isNeg ? '-' : ''}₹${formatted}`;
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
  const clamped = Math.min(Math.max(value, min), max);
  const pct = max > min ? ((clamped - min) / (max - min)) * 100 : 0;

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
          <span>{minLabel}</span>
          <span>{midLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

export function VerifiedAuthorityBanner({ source }: { source: VerifiedSourceMeta }) {
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
      <div className="flex items-center gap-3">
        <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
          Verified: {source.dateVerified}
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
  return (
    <section className="pt-8 border-t border-outline-variant/40 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-on-surface">Related Financial Calculators</h2>
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
