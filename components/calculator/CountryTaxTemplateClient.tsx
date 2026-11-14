'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { calculateCountryTax } from '@/lib/finance-core/tax-payroll-business-engines';
import { VERIFIED_INTERNATIONAL_COUNTRIES } from '@/lib/finance-core/tax-payroll-business-data';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { formatWithGlobalCurrency, useCurrency } from '@/lib/currency';
import { RotateCcw, Globe, Calendar, ExternalLink, AlertCircle, UserCheck } from 'lucide-react';

export default function CountryTaxTemplateClient({
  initialCountry,
}: {
  initialCountry: 'germany' | 'france' | 'uae' | 'singapore';
}) {
  const { symbol: globalSymbol } = useCurrency();
  const [countrySlug, setCountrySlug] = useState<'germany' | 'france' | 'uae' | 'singapore'>(initialCountry);
  const [grossIncome, setGrossIncome] = useState<number>(
    initialCountry === 'uae' ? 360000 : initialCountry === 'singapore' ? 120000 : 75000
  );
  const [isMarriedSplitting, setIsMarriedSplitting] = useState<boolean>(false);
  const [optionalDeductions, setOptionalDeductions] = useState<number>(0);
  const [includeChurchOrNationalPension, setIncludeChurchOrNationalPension] = useState<boolean>(
    initialCountry === 'singapore'
  );

  const result = useMemo(
    () =>
      calculateCountryTax({
        countrySlug,
        grossIncome,
        isMarriedSplitting,
        optionalDeductions,
        includeChurchOrNationalPension,
      }),
    [countrySlug, grossIncome, isMarriedSplitting, optionalDeductions, includeChurchOrNationalPension]
  );

  const sym = globalSymbol || result.profile.currencySymbol;
  const fmt = (val: number) =>
    formatWithGlobalCurrency(val, {
      fromCurrency: result.profile.currencySymbol,
      decimals: 0,
    });

  return (
    <div className="space-y-6">
      <VerifiedSourceBadge
        authority={result.profile.source.authority}
        document={result.profile.source.document}
        verifiedDate={result.profile.source.verifiedDate}
        url={result.profile.source.url}
      />

      {/* Tax Year, Statutory Schedule & Country Switcher Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs">
        <div className="flex items-center gap-2 text-[var(--text)] font-semibold">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>
            Tax Year: {result.profile.taxYear} · Statutory Schedule: {result.profile.source.document}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(['germany', 'france', 'uae', 'singapore'] as const).map((slug) => {
            const p = VERIFIED_INTERNATIONAL_COUNTRIES[slug];
            return (
              <Link
                key={slug}
                href={`/finance/${slug}-income-tax-calculator`}
                onClick={() => setCountrySlug(slug)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                  countrySlug === slug
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                {p.flag} {p.countryName}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 flex flex-col justify-start gap-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>
                  {result.profile.flag} {result.profile.countryName} ({result.profile.taxYear})
                </span>
              </div>
              <button
                onClick={() => {
                  setGrossIncome(countrySlug === 'uae' ? 360000 : countrySlug === 'singapore' ? 120000 : 75000);
                  setIsMarriedSplitting(false);
                  setOptionalDeductions(0);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Annual Gross Income ({result.profile.currencyCode})
                </label>
                <input
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value)))}
                  className="w-36 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
                />
              </div>
              <UnboxedSlider
                ariaLabel="Annual Gross Income"
                min={20000}
                max={countrySlug === 'uae' ? 1500000 : 500000}
                step={5000}
                value={grossIncome}
                onChange={setGrossIncome}
                minLabel={`${sym}20k`}
                midLabel={countrySlug === 'uae' ? `${sym}750k` : `${sym}250k`}
                maxLabel={countrySlug === 'uae' ? `${sym}1.5M` : `${sym}500k`}
              />
            </div>

            {(countrySlug === 'germany' || countrySlug === 'france') && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  Filing Status / Quotient Familial
                </label>
                <select
                  aria-label="Filing Status"
                  value={isMarriedSplitting ? 'married' : 'single'}
                  onChange={(e) => setIsMarriedSplitting(e.target.value === 'married')}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
                >
                  <option value="single">Single (Grundtarif / 1 Part)</option>
                  <option value="married">Married Joint Splitting (Splittingtarif / 2 Parts)</option>
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Additional Tax Deductions ({sym}/yr)
                </label>
                <input
                  type="number"
                  value={optionalDeductions}
                  onChange={(e) => setOptionalDeductions(Math.max(0, Number(e.target.value)))}
                  className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 pt-2 text-xs font-semibold text-[var(--text)] cursor-pointer">
              <input
                type="checkbox"
                checked={includeChurchOrNationalPension}
                onChange={(e) => setIncludeChurchOrNationalPension(e.target.checked)}
                className="rounded border-[var(--border)] text-blue-600"
              />
              <span>
                {countrySlug === 'germany'
                  ? 'Include 9% Church Tax (Kirchensteuer)'
                  : countrySlug === 'uae'
                  ? 'UAE National (Include 5% GPSSA Pension Contribution)'
                  : countrySlug === 'singapore'
                  ? 'Singapore Citizen / PR (Include 20% Employee CPF)'
                  : 'Apply Standard Social Contributions'}
              </span>
            </label>
          </div>

          <div className="hidden lg:flex flex-col justify-between gap-3 pt-4 border-t border-[var(--border)]">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                Quick Income Benchmarks ({result.profile.currencyCode})
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(countrySlug === 'uae' ? [180000, 360000, 720000] : countrySlug === 'singapore' ? [60000, 120000, 240000] : [45000, 75000, 130000]).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setGrossIncome(preset)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold tabular-nums transition ${
                      grossIncome === preset
                        ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-blue-500/40'
                    }`}
                  >
                    {sym}{(preset / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--muted)]">
              Includes {result.profile.taxYear} statutory national brackets, social security ceilings, and mandatory payroll levies for {result.profile.countryName}.
            </p>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-500/5 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {result.profile.countryName} Net Take-Home Pay ({result.profile.taxYear})
                </div>
                <div className="text-3xl font-extrabold tabular-nums text-[var(--text)] mt-1">
                  {fmt(result.netAnnual)}
                  <span className="text-sm font-semibold text-[var(--muted)] ml-1.5">/ year</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-[var(--muted)]">Effective / Marginal Rate</div>
                <div className="text-xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatPct(result.effectiveRatePct, 1)} / {formatPct(result.marginalRatePct, 1)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[var(--border)]">
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)]">Monthly Net Pay</div>
                <div className="text-base font-bold tabular-nums">{fmt(result.netMonthly)}</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)]">Income Tax</div>
                <div className="text-base font-bold tabular-nums">{fmt(result.incomeTax)}</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)]">Social / Pension</div>
                <div className="text-base font-bold tabular-nums">{fmt(result.socialContributions)}</div>
              </div>
            </div>
          </div>

          {/* Local Filing Deadlines, Authority Link & What Is Not Included */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
              <div className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Statutory Filing Deadline &amp; Official Authority</span>
              </div>
              <a
                href={result.profile.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                {result.profile.source.authority} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-[var(--muted)]">
              <strong className="text-[var(--text)]">Filing Deadline:</strong> {result.profile.filingDeadline}
            </p>
            <p className="text-[var(--muted)]">
              <strong className="text-[var(--text)]">Social Contributions Note:</strong>{' '}
              {result.profile.socialContributionSummary}
            </p>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>What Is Not Included in This Statutory Estimate:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[var(--muted)]">
                {result.profile.whatIsNotIncluded.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'UK PAYE Tax Calculator',
            path: '/finance/uk-paye-calculator',
            desc: 'HMRC 2025/26 income tax bands, National Insurance, and pension sacrifice.',
          },
          {
            title: 'US Federal Income Tax Calculator',
            path: '/finance/us-federal-income-tax-calculator',
            desc: 'IRS 2025 progressive tax brackets and standard deduction engine.',
          },
          {
            title: 'Salary to Hourly Calculator',
            path: '/finance/salary-to-hourly-calculator',
            desc: 'Convert annual compensation across hourly, weekly, and monthly periods.',
          },
        ]}
      />
    </div>
  );
}
