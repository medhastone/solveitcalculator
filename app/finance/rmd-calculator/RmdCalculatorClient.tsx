'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Percent, Scale, TrendingUp, AlertTriangle, Download, Copy, Check, RotateCcw, ChevronDown, ChevronUp, ArrowUpRight, Landmark, ShieldCheck, Clock, FileText, Users, Info, ExternalLink } from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateRmd } from '@/lib/finance-core/rmd';
import rmdTablesData from '@/data/rmd-tables.json';
import {
  formatWithGlobalCurrency,
  formatCompactWithGlobalCurrency,
  useCurrency,
} from '@/lib/currency';

function formatCurrency(val: number, decimals = 0) {
  return formatWithGlobalCurrency(val, {
    fromCurrency: 'USD',
    decimals,
  });
}
function formatCompactCurrency(val: number) {
  return formatCompactWithGlobalCurrency(val, {
    fromCurrency: 'USD',
  });
}
export default function RmdCalculatorClient() {
    useCurrency();
    // Primary Inputs
    const [distributionYear, setDistributionYear] = useState(2026);
    const [birthYear, setBirthYear] = useState(1953); // Age 73 in 2026
    const [ownerAge, setOwnerAge] = useState(73);
    const [priorYearEndBalance, setPriorYearEndBalance] = useState(500000);
    const [isSpouseMoreThan10YearsYounger, setIsSpouseMoreThan10YearsYounger] = useState(false);
    const [spouseAge, setSpouseAge] = useState(60);
    // Optional Planning Inputs
    const [estimatedAnnualReturnPercent, setEstimatedAnnualReturnPercent] = useState(6.0);
    const [estimatedMarginalTaxRatePercent, setEstimatedMarginalTaxRatePercent] = useState(22.0);
    // UI Controls
    const [showFullSchedule, setShowFullSchedule] = useState(false);
    const [showUniformTableLookup, setShowUniformTableLookup] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    // Synchronize URL query parameters on mount
    useEffect(() => {
        if ("undefined" === 'undefined')
            return;
        const params = new URLSearchParams(window.location.search);
        const yrParam = Number(params.get('yr'));
        const byParam = Number(params.get('by'));
        const ageParam = Number(params.get('age'));
        const balParam = Number(params.get('bal'));
        const spYoungerParam = params.get('spy');
        const spAgeParam = Number(params.get('spage'));
        const retParam = Number(params.get('r'));
        const taxParam = Number(params.get('tax'));
        const activeDistYear = yrParam >= 2024 && yrParam <= 2035 ? yrParam : 2026;
        setDistributionYear(activeDistYear);
        if (byParam >= 1915 && byParam <= 1995) {
            setBirthYear(byParam);
            setOwnerAge(activeDistYear - byParam);
        }
        else if (ageParam >= 50 && ageParam <= 115) {
            setOwnerAge(ageParam);
            setBirthYear(activeDistYear - ageParam);
        }
        if (balParam > 0 && balParam <= 100000000)
            setPriorYearEndBalance(balParam);
        if (spYoungerParam === '1' || spYoungerParam === 'true') {
            setIsSpouseMoreThan10YearsYounger(true);
        }
        if (spAgeParam >= 25 && spAgeParam <= 105)
            setSpouseAge(spAgeParam);
        if (retParam >= 0 && retParam <= 15)
            setEstimatedAnnualReturnPercent(retParam);
        if (taxParam >= 0 && taxParam <= 50)
            setEstimatedMarginalTaxRatePercent(taxParam);
    }, []);
    const handleBirthYearChange = (newBirthYear) => {
        const clampedBy = Math.max(1910, Math.min(1995, Math.round(newBirthYear)));
        setBirthYear(clampedBy);
        setOwnerAge(distributionYear - clampedBy);
    };
    const handleOwnerAgeChange = (newAge) => {
        const clampedAge = Math.max(50, Math.min(115, Math.round(newAge)));
        setOwnerAge(clampedAge);
        setBirthYear(distributionYear - clampedAge);
    };
    const handleDistributionYearChange = (newDistYear) => {
        setDistributionYear(newDistYear);
        setOwnerAge(newDistYear - birthYear);
    };
    const result = useMemo(() => {
        return calculateRmd({
            birthYear,
            ownerAge,
            distributionYear,
            priorYearEndBalance,
            isSpouseMoreThan10YearsYounger,
            spouseAge,
            estimatedAnnualReturnPercent,
            estimatedMarginalTaxRatePercent
        });
    }, [
        birthYear,
        ownerAge,
        distributionYear,
        priorYearEndBalance,
        isSpouseMoreThan10YearsYounger,
        spouseAge,
        estimatedAnnualReturnPercent,
        estimatedMarginalTaxRatePercent
    ]);
    const handleReset = () => {
        setDistributionYear(2026);
        setBirthYear(1953);
        setOwnerAge(73);
        setPriorYearEndBalance(500000);
        setIsSpouseMoreThan10YearsYounger(false);
        setSpouseAge(60);
        setEstimatedAnnualReturnPercent(6.0);
        setEstimatedMarginalTaxRatePercent(22.0);
    };
    const handleCopyLink = () => {
        if ("undefined" === 'undefined')
            return;
        const params = new URLSearchParams({
            yr: String(distributionYear),
            by: String(birthYear),
            age: String(ownerAge),
            bal: String(priorYearEndBalance),
            spy: isSpouseMoreThan10YearsYounger ? '1' : '0',
            spage: String(spouseAge),
            r: String(estimatedAnnualReturnPercent),
            tax: String(estimatedMarginalTaxRatePercent)
        });
        const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };
    const handleExportCsv = () => {
        const headers = [
            'Calendar Year',
            'Owner Age',
            'Spouse Age',
            'Prior Year-End Balance ($)',
            'IRS Distribution Period Factor',
            'Required Minimum Distribution ($)',
            'RMD % of Balance',
            'Assumed Investment Growth ($)',
            'Projected Ending Balance ($)'
        ];
        const rows = result.schedule.map((r) => [
            r.year,
            r.age,
            r.spouseAge ?? 'N/A (Table III)',
            r.priorYearEndBalance.toFixed(2),
            r.distributionPeriod.toFixed(1),
            r.rmdAmount.toFixed(2),
            `${r.rmdPercentOfBalance.toFixed(2)}%`,
            r.investmentGrowth.toFixed(2),
            r.endingBalance.toFixed(2)
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map((r) => r.join(','))
        ].join('\n');
        const blob = new Blob([
            csvContent
        ], {
            type: 'text/csv;charset=utf-8;'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rmd-schedule-age-${result.calculationAge}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };
    const displayedSchedule = showFullSchedule ? result.schedule : result.schedule.slice(0, 10);
    return <div className="space-y-8"><div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"><div className="lg:col-span-5 lg:sticky lg:top-20 space-y-5 bg-surface-container border border-outline-variant/60 rounded-2xl p-5 sm:p-6 shadow-sm"><div className="flex items-center justify-between border-b border-outline-variant/40 pb-3.5"><div><h2 className="text-base font-bold text-on-surface flex items-center gap-2"><CalculatorIcon className="w-4 h-4 text-primary"/><span>RMD Parameters</span></h2><p className="text-xs text-on-surface-variant mt-0.5">IRS Pub 590-B (Tables II & III) · SECURE 2.0 Act</p></div><div className="flex items-center gap-1.5"><button type="button" onClick={handleCopyLink} className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1" title="Copy shareable scenario link">{copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500"/> : <Copy className="w-3.5 h-3.5"/>}<span>{copiedLink ? 'Copied' : 'Share'}</span></button><button type="button" onClick={handleReset} className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors" title="Reset to defaults" aria-label="Reset inputs"><RotateCcw className="w-3.5 h-3.5"/></button></div></div><div className="space-y-1.5"><span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">Quick Cohorts</span><div className="grid grid-cols-3 gap-2"><button type="button" onClick={() => {
        setDistributionYear(2026);
        setBirthYear(1953);
        setOwnerAge(73);
        setIsSpouseMoreThan10YearsYounger(false);
    }} className={`px-2.5 py-2 rounded-xl border text-left transition-all ${ownerAge === 73 && !isSpouseMoreThan10YearsYounger ? 'border-primary bg-primary/10 text-on-surface' : 'border-outline-variant/60 bg-surface-container-low hover:border-outline text-on-surface-variant'}`}><div className="text-xs font-bold text-on-surface tabular-nums">Age 73 (1953)</div><div className="text-[10px] text-on-surface-variant">1st RMD · Table III</div></button><button type="button" onClick={() => {
        setDistributionYear(2026);
        setBirthYear(1946);
        setOwnerAge(80);
        setIsSpouseMoreThan10YearsYounger(false);
    }} className={`px-2.5 py-2 rounded-xl border text-left transition-all ${ownerAge === 80 && !isSpouseMoreThan10YearsYounger ? 'border-primary bg-primary/10 text-on-surface' : 'border-outline-variant/60 bg-surface-container-low hover:border-outline text-on-surface-variant'}`}><div className="text-xs font-bold text-on-surface tabular-nums">Age 80 (1946)</div><div className="text-[10px] text-on-surface-variant">Ongoing · Factor 20.2</div></button><button type="button" onClick={() => {
        setDistributionYear(2026);
        setBirthYear(1951);
        setOwnerAge(75);
        setIsSpouseMoreThan10YearsYounger(true);
        setSpouseAge(60);
    }} className={`px-2.5 py-2 rounded-xl border text-left transition-all ${ownerAge === 75 && isSpouseMoreThan10YearsYounger ? 'border-primary bg-primary/10 text-on-surface' : 'border-outline-variant/60 bg-surface-container-low hover:border-outline text-on-surface-variant'}`}><div className="text-xs font-bold text-on-surface tabular-nums">Age 75 + Spouse 60</div><div className="text-[10px] text-on-surface-variant">Joint Table II</div></button></div></div><div className="space-y-3 pt-1"><div className="flex items-center justify-between"><label htmlFor="owner-age-input" className="text-xs font-bold text-on-surface flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary"/><span>{"Birth Year & Age in "}{distributionYear}</span></label><select aria-label="Distribution calendar year" value={distributionYear} onChange={(e) => handleDistributionYearChange(Number(e.target.value))} className="px-2 py-1 rounded-lg bg-surface-container-low border border-outline-variant/60 text-xs font-semibold text-on-surface tabular-nums focus:outline-none focus:border-primary"><option value={2025}>Tax Year 2025</option><option value={2026}>Tax Year 2026</option><option value={2027}>Tax Year 2027</option></select></div><div className="grid grid-cols-2 gap-3"><div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60"><label htmlFor="birth-year-input" className="block text-[11px] text-on-surface-variant font-medium">Owner Birth Year</label><input id="birth-year-input" type="number" min={1910} max={1995} value={birthYear} onChange={(e) => handleBirthYearChange(Number(e.target.value))} className="w-full mt-1 bg-transparent text-base font-bold text-on-surface tabular-nums focus:outline-none"/></div><div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60"><label htmlFor="owner-age-input" className="block text-[11px] text-on-surface-variant font-medium">Age at Year-End ({distributionYear})</label><input id="owner-age-input" type="number" min={50} max={115} value={ownerAge} onChange={(e) => handleOwnerAgeChange(Number(e.target.value))} className="w-full mt-1 bg-transparent text-base font-bold text-on-surface tabular-nums focus:outline-none"/></div></div><input type="range" aria-label="Account owner age slider" min={60} max={105} step={1} value={Math.min(105, Math.max(60, ownerAge))} onChange={(e) => handleOwnerAgeChange(Number(e.target.value))} className="w-full accent-primary cursor-pointer h-1.5 bg-surface-container-high rounded-lg"/><div className="flex justify-between text-[11px] text-on-surface-variant tabular-nums"><span>Age 60 ({distributionYear - 60})</span><span className="font-semibold text-primary">{"RMD Start Age: "}{result.rmdStartAge}{" (Born "}{birthYear})</span><span>Age 105</span></div></div><div className="space-y-2 pt-2 border-t border-outline-variant/40"><div className="flex items-center justify-between"><label htmlFor="prior-balance-input" className="text-xs font-bold text-on-surface flex items-center gap-1.5"><Landmark className="w-3.5 h-3.5 text-primary"/><span>{"Prior Year-End Balance (Dec 31, "}{distributionYear - 1})</span></label><span className="text-xs font-bold text-primary tabular-nums">{formatCurrency(priorYearEndBalance)}</span></div><div className="relative flex items-center"><span className="absolute left-3 text-sm font-bold text-on-surface-variant">$</span><input id="prior-balance-input" type="number" min={1000} max={50000000} step={5000} value={priorYearEndBalance} onChange={(e) => setPriorYearEndBalance(Math.max(0, Number(e.target.value)))} className="w-full pl-7 pr-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm font-bold text-on-surface tabular-nums focus:outline-none focus:border-primary"/></div><input type="range" aria-label="Prior year-end balance slider" min={25000} max={3000000} step={25000} value={Math.min(3000000, Math.max(25000, priorYearEndBalance))} onChange={(e) => setPriorYearEndBalance(Number(e.target.value))} className="w-full accent-primary cursor-pointer h-1.5 bg-surface-container-high rounded-lg"/><div className="grid grid-cols-4 gap-1.5 pt-0.5">{[
        250000,
        500000,
        1000000,
        2000000
    ].map((preset) => <button key={preset} type="button" onClick={() => setPriorYearEndBalance(preset)} className={`py-1 rounded-lg text-[11px] font-semibold tabular-nums border transition-colors ${priorYearEndBalance === preset ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/50 bg-surface-container-low text-on-surface-variant hover:text-on-surface'}`}>{formatCompactCurrency(preset)}</button>)}</div></div><div className="space-y-3 pt-2 border-t border-outline-variant/40"><div className="space-y-1"><span className="text-xs font-bold text-on-surface flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary"/><span>Spouse More Than 10 Years Younger & Sole Beneficiary?</span></span><p className="text-[11px] text-on-surface-variant leading-snug">Determines whether IRS Uniform Lifetime Table (Table III) or Joint Life Expectancy Table (Table II) applies.</p></div><div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-surface-container-low border border-outline-variant/60"><button type="button" onClick={() => setIsSpouseMoreThan10YearsYounger(false)} className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${!isSpouseMoreThan10YearsYounger ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>No (Standard Table III)</button><button type="button" onClick={() => {
        setIsSpouseMoreThan10YearsYounger(true);
        if (ownerAge - spouseAge <= 10) {
            setSpouseAge(Math.max(25, ownerAge - 14));
        }
    }} className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${isSpouseMoreThan10YearsYounger ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Yes (Joint Table II)</button></div>{isSpouseMoreThan10YearsYounger && <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-2.5"><div className="flex items-center justify-between"><label htmlFor="spouse-age-input" className="text-xs font-bold text-on-surface">{"Spouse's Age in "}{distributionYear}</label><span className="text-xs font-bold text-primary tabular-nums">{"Age "}{spouseAge}{" ("}{result.calculationAge - spouseAge}{" yrs younger)"}</span></div><div className="flex items-center gap-3"><input id="spouse-age-input" type="number" min={20} max={105} value={spouseAge} onChange={(e) => setSpouseAge(Math.max(20, Math.min(105, Number(e.target.value))))} className="w-24 px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/60 text-sm font-bold text-on-surface tabular-nums focus:outline-none focus:border-primary"/><input type="range" aria-label="Spouse age slider" min={30} max={Math.max(35, result.calculationAge - 1)} step={1} value={Math.min(Math.max(35, result.calculationAge - 1), Math.max(30, spouseAge))} onChange={(e) => setSpouseAge(Number(e.target.value))} className="flex-1 accent-primary cursor-pointer h-1.5 bg-surface-container-high rounded-lg"/></div>{result.qualifiesForJointLifeTable ? <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium leading-snug">Qualifies for IRS Table II (Joint Life): Distribution period increases from{' '}<span className="font-bold tabular-nums">{result.uniformLifetimeFactorForComparison}</span>{" to"}{' '}<span className="font-bold tabular-nums">{result.distributionPeriod}</span>, reducing your RMD by{' '}<span className="font-bold tabular-nums">{formatCurrency(priorYearEndBalance / result.uniformLifetimeFactorForComparison - result.rmdAmount, 0)}</span>.</p> : <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium leading-snug">{"Spouse must be at least 11 years younger (≤ Age "}{result.calculationAge - 11}) to use IRS Table II. Reverting to Uniform Lifetime Table (Table III).</p>}</div>}</div><div className="space-y-3 pt-2 border-t border-outline-variant/40"><span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block">Projection & Tax Assumptions</span><div className="grid grid-cols-2 gap-3"><div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60"><div className="flex justify-between items-center"><label htmlFor="return-rate-input" className="text-[11px] text-on-surface-variant font-medium">Annual Return</label><span className="text-xs font-bold text-on-surface tabular-nums">{estimatedAnnualReturnPercent.toFixed(1)}%</span></div><input id="return-rate-input" type="range" min={0} max={12} step={0.5} value={estimatedAnnualReturnPercent} onChange={(e) => setEstimatedAnnualReturnPercent(Number(e.target.value))} className="w-full mt-2 accent-primary cursor-pointer h-1.5 bg-surface-container-high rounded-lg"/></div><div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60"><div className="flex justify-between items-center"><label htmlFor="tax-rate-input" className="text-[11px] text-on-surface-variant font-medium">Marginal Tax Rate</label><span className="text-xs font-bold text-on-surface tabular-nums">{estimatedMarginalTaxRatePercent.toFixed(0)}%</span></div><input id="tax-rate-input" type="range" min={0} max={40} step={1} value={estimatedMarginalTaxRatePercent} onChange={(e) => setEstimatedMarginalTaxRatePercent(Number(e.target.value))} className="w-full mt-2 accent-primary cursor-pointer h-1.5 bg-surface-container-high rounded-lg"/></div></div></div></div><div className="lg:col-span-7 space-y-6"><div className={`p-4 rounded-2xl border flex items-start gap-3 ${result.isRmdRequiredForSelectedAge ? 'bg-primary/10 border-primary/30' : 'bg-amber-500/10 border-amber-500/30'}`}><ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${result.isRmdRequiredForSelectedAge ? 'text-primary' : 'text-amber-600 dark:text-amber-400'}`}/><div className="space-y-1 text-xs"><div className="flex flex-wrap items-center gap-2"><span className="font-bold text-on-surface text-sm">{"SECURE 2.0 RMD Start Age: "}{result.rmdStartAge}</span><span className="px-2 py-0.5 rounded-md bg-surface-container text-[11px] font-semibold text-on-surface-variant border border-outline-variant/50 tabular-nums">{result.secure2CohortLabel}</span></div>{result.isRmdRequiredForSelectedAge ? <p className="text-on-surface-variant leading-relaxed">{"At age "}<strong className="text-on-surface tabular-nums">{ownerAge}</strong>{" in"}{' '}<strong className="text-on-surface tabular-nums">{distributionYear}</strong>{", a Required Minimum Distribution is "}<strong className="text-on-surface">mandatory</strong>{" for pre-tax retirement accounts."}{result.isFirstRmdYear && <span>{' '}{"Because "}{distributionYear}{" is your "}<strong>first RMD year</strong>, you may take this withdrawal by{' '}<strong className="text-on-surface">{"December 31, "}{distributionYear}</strong>{" or defer it up to your Required Beginning Date of"}{' '}<strong className="text-on-surface">{"April 1, "}{distributionYear + 1}</strong>.</span>}</p> : <p className="text-on-surface-variant leading-relaxed">{"At age "}<strong className="text-on-surface tabular-nums">{ownerAge}</strong>{" (born"}{' '}<strong className="text-on-surface tabular-nums">{birthYear}</strong>), your mandatory RMD for{' '}{distributionYear}{" is "}<strong className="text-on-surface">$0</strong>{" ("}{result.yearsUntilRmdStarts}{' '}{result.yearsUntilRmdStarts === 1 ? 'year' : 'years'}{" until RMDs start at age"}{' '}<strong className="text-on-surface tabular-nums">{result.rmdStartAge}</strong>{" in"}{' '}<strong className="text-on-surface tabular-nums">{result.rmdStartYear}</strong>).{' '}{result.isPreviewAtStartAge && <span>The figures below show your benchmark RMD calculation at your starting age of{' '}<strong className="text-on-surface tabular-nums">{result.calculationAge}</strong>.</span>}</p>}</div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="p-5 rounded-2xl bg-surface-container border-2 border-primary/50 space-y-3 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-primary">Required Minimum Distribution</span><span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-bold tabular-nums">{"Age "}{result.calculationAge}{" RMD"}</span></div><div className="text-3xl sm:text-4xl font-extrabold text-on-surface tabular-nums tracking-tight">{formatCurrency(result.rmdAmount, 2)}</div><div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/40 text-xs"><div><span className="text-on-surface-variant block text-[11px]">Monthly Equivalent</span><span className="font-bold text-on-surface tabular-nums">{formatCurrency(result.monthlyRmdEquivalent, 2)}/mo</span></div><div><span className="text-on-surface-variant block text-[11px]">Est. After-Tax ({estimatedMarginalTaxRatePercent}%)</span><span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatCurrency(result.estimatedAfterTaxRmd, 0)}</span></div></div></div><div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-3"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">% of Balance & IRS Factor</span><span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[11px] font-semibold">{result.applicableTableCode}</span></div><div className="flex items-baseline gap-3"><div className="text-3xl sm:text-4xl font-extrabold text-on-surface tabular-nums tracking-tight">{result.rmdPercentOfBalance.toFixed(2)}%</div><div className="text-sm font-bold text-primary tabular-nums">{"\xf7 "}{result.distributionPeriod.toFixed(1)}{" yrs"}</div></div><div className="pt-2 border-t border-outline-variant/40 text-xs space-y-1"><div className="flex justify-between text-on-surface-variant"><span>Formula:</span><span className="font-mono font-semibold text-on-surface tabular-nums">{formatCurrency(priorYearEndBalance)}{" \xf7 "}{result.distributionPeriod.toFixed(1)}</span></div><div className="flex justify-between text-on-surface-variant"><span>Remaining Principal:</span><span className="font-bold text-on-surface tabular-nums">{formatCurrency(result.remainingBalanceAfterRmd, 0)}</span></div></div></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-2"><div className="flex items-center gap-2 text-xs font-bold text-on-surface"><Clock className="w-4 h-4 text-primary"/><span>Mandatory Distribution Deadline</span></div><div className="text-base font-extrabold text-on-surface tabular-nums">{result.standardDeadline}</div><p className="text-xs text-on-surface-variant leading-relaxed">{result.calculationAge === result.rmdStartAge ? <><strong>First-Year Grace Period:</strong>{" You may delay your very first RMD (for age"}{' '}{result.rmdStartAge}) until{' '}<strong className="text-on-surface">{result.firstYearRbdDeadline}</strong>{". All subsequent annual RMDs must be taken by "}<strong>December 31</strong>{" each year."}</> : <>{"Ongoing annual RMDs must be withdrawn by "}<strong>December 31</strong>{" of each distribution calendar year. The April 1 Required Beginning Date deferral applies only to your first RMD year (age"}{' '}{result.rmdStartAge}).</>}</p></div><div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-2"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-bold text-on-surface"><AlertTriangle className="w-4 h-4 text-amber-500"/><span>IRS Penalty Note (SECURE 2.0 § 302)</span></div><span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">IRC § 4974</span></div><div className="flex items-baseline gap-4"><div><span className="text-[11px] text-on-surface-variant block">Standard Penalty (25%)</span><span className="text-base font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">{formatCurrency(result.standardPenaltyAmountOnFullMiss, 0)}</span></div><div className="border-l border-outline-variant/50 pl-4"><span className="text-[11px] text-on-surface-variant block">Timely Correction (10%)</span><span className="text-base font-extrabold text-on-surface tabular-nums">{formatCurrency(result.timelyCorrectionPenaltyAmountOnFullMiss, 0)}</span></div></div><p className="text-xs text-on-surface-variant leading-relaxed">{"SECURE 2.0 reduced the missed-RMD excise tax from 50% to "}<strong>25%</strong>{" of the shortfall, and down to "}<strong>10%</strong>{" if corrected within the 2-year correction window via "}<strong>IRS Form 5329</strong>.</p></div></div><div className="p-5 sm:p-6 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-base font-bold text-on-surface flex items-center gap-2"><Scale className="w-4 h-4 text-primary"/><span>First-Year RMD Deferral Explained: Dec 31 vs. April 1 Tax Stacking</span></h3><p className="text-xs text-on-surface-variant mt-0.5">{"Evaluating the Required Beginning Date (RBD) grace period at age "}{result.firstYearDeferral.firstYearAge}</p></div><span className="px-2.5 py-1 rounded-lg bg-surface-container-high text-xs font-semibold text-on-surface-variant">{"Assumes "}{estimatedAnnualReturnPercent.toFixed(1)}% Return</span></div><p className="text-xs text-on-surface-variant leading-relaxed">{"The IRS permits you to delay your "}<strong>first</strong>{" Required Minimum Distribution until"}{' '}<strong>April 1 of the following year</strong>{". However, if you wait until between January 1 and April 1 of Year 2 to take your Year 1 RMD, you must still take your Year 2 RMD by "}<strong>December 31 of Year 2</strong>. Furthermore, because your Year 1 RMD was not withdrawn by December 31 of Year 1, your Year 1 ending balance is larger—slightly increasing your Year 2 RMD as well.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-2.5"><div className="flex items-center justify-between"><span className="text-xs font-bold text-on-surface">{"Option A: Take 1st RMD by Dec 31, "}{result.firstYearDeferral.firstYearCalendarYear}</span><span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">Smooth Tax Brackets</span></div><div className="space-y-1.5 text-xs pt-1"><div className="flex justify-between"><span className="text-on-surface-variant">{result.firstYearDeferral.firstYearCalendarYear}{" Taxable RMD (Year 1):"}</span><span className="font-bold text-on-surface tabular-nums">{formatCurrency(result.firstYearDeferral.year1RmdAmount, 0)}</span></div><div className="flex justify-between"><span className="text-on-surface-variant">{result.firstYearDeferral.secondYearCalendarYear}{" Taxable RMD (Year 2):"}</span><span className="font-bold text-on-surface tabular-nums">{formatCurrency(result.firstYearDeferral.year2RmdIfTakenOnTime, 0)}</span></div><div className="flex justify-between pt-1.5 border-t border-outline-variant/40"><span className="font-semibold text-on-surface">Max Single-Year Taxable RMD:</span><span className="font-extrabold text-primary tabular-nums">{formatCurrency(Math.max(result.firstYearDeferral.year1RmdAmount, result.firstYearDeferral.year2RmdIfTakenOnTime), 0)}</span></div></div></div><div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 space-y-2.5"><div className="flex items-center justify-between"><span className="text-xs font-bold text-on-surface">{"Option B: Defer 1st RMD to Apr 1, "}{result.firstYearDeferral.secondYearCalendarYear}</span><span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">{"2 RMDs in "}{result.firstYearDeferral.secondYearCalendarYear}</span></div><div className="space-y-1.5 text-xs pt-1"><div className="flex justify-between"><span className="text-on-surface-variant">{result.firstYearDeferral.firstYearCalendarYear}{" Taxable RMD (Year 1):"}</span><span className="font-bold text-on-surface tabular-nums">$0</span></div><div className="flex justify-between"><span className="text-on-surface-variant">{result.firstYearDeferral.secondYearCalendarYear}{" Combined RMDs (Yr 1 + Yr 2):"}</span><span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">{formatCurrency(result.firstYearDeferral.totalYear2TaxableIfDeferred, 0)}</span></div><div className="flex justify-between pt-1.5 border-t border-outline-variant/40"><span className="font-semibold text-on-surface">Higher Yr 2 RMD from Unreduced Bal:</span><span className="font-bold text-on-surface tabular-nums">+{formatCurrency(result.firstYearDeferral.extraYear2RmdFromHigherBalance, 0)}</span></div></div></div></div></div><div className="p-5 sm:p-6 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-base font-bold text-on-surface flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary"/><span>Multi-Year RMD & Portfolio Balance Projection</span></h3><p className="text-xs text-on-surface-variant mt-0.5">{"Annual mandatory withdrawal ($) vs. remaining balance from Age "}{result.calculationAge}{" to"}{' '}{result.schedule[result.schedule.length - 1]?.age}{" ("}{estimatedAnnualReturnPercent.toFixed(1)}% return)</p></div></div><div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={result.schedule} margin={{
        top: 10,
        right: 15,
        left: 5,
        bottom: 5
    }}><CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-outline-variant/30"/><XAxis dataKey="age" tickFormatter={(v) => `Age ${v}`} tick={{
        fontSize: 11,
        fill: 'currentColor'
    }} className="text-on-surface-variant"/><YAxis yAxisId="left" tickFormatter={(v) => formatCompactCurrency(v)} tick={{
        fontSize: 11,
        fill: 'currentColor'
    }} className="text-on-surface-variant" width={65}/><YAxis yAxisId="right" orientation="right" tickFormatter={(v) => formatCompactCurrency(v)} tick={{
        fontSize: 11,
        fill: 'currentColor'
    }} className="text-on-surface-variant" width={65}/><Tooltip formatter={(value, name) => [
        formatCurrency(Number(value), 0),
        String(name)
    ]} labelFormatter={(label) => `Age ${label}`} contentStyle={{
        borderRadius: '12px',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        color: '#f8fafc',
        fontSize: '12px'
    }}/><Legend wrapperStyle={{
        fontSize: '12px'
    }}/><Bar yAxisId="left" dataKey="rmdAmount" name="Annual RMD ($)" fill="#3b82f6" radius={[
        4,
        4,
        0,
        0
    ]}/><Line yAxisId="right" type="monotone" dataKey="endingBalance" name="Ending Portfolio Balance ($)" stroke="#10b981" strokeWidth={2.5} dot={false}/></ComposedChart></ResponsiveContainer></div></div></div></div><div className="p-5 sm:p-6 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-base font-bold text-on-surface flex items-center gap-2"><FileText className="w-4 h-4 text-primary"/><span>Year-by-Year IRS RMD Distribution Schedule ({result.applicableTableCode})</span></h3><p className="text-xs text-on-surface-variant mt-0.5">Showing mandatory distribution periods, annual RMD dollar amounts, and percentage of balance</p></div><button type="button" onClick={handleExportCsv} className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5 border border-outline-variant/50"><Download className="w-3.5 h-3.5 text-primary"/><span>Export CSV</span></button></div><div className="overflow-x-auto"><table className="w-full text-left border-collapse text-xs tabular-nums"><thead><tr className="border-b border-outline-variant/50 text-on-surface-variant font-bold"><th className="py-2.5 px-3">Year</th><th className="py-2.5 px-3">Owner Age</th>{result.qualifiesForJointLifeTable && <th className="py-2.5 px-3">Spouse Age</th>}<th className="py-2.5 px-3 text-right">Prior Dec 31 Balance</th><th className="py-2.5 px-3 text-right">IRS Factor</th><th className="py-2.5 px-3 text-right">Required RMD ($)</th><th className="py-2.5 px-3 text-right">% of Balance</th><th className="py-2.5 px-3 text-right">Ending Balance</th></tr></thead><tbody className="divide-y divide-outline-variant/30">{displayedSchedule.map((row) => <tr key={row.age} className={row.age === result.calculationAge ? 'bg-primary/10 font-semibold text-on-surface' : 'hover:bg-surface-container-low text-on-surface-variant'}><td className="py-2.5 px-3 font-medium text-on-surface">{row.year}</td><td className="py-2.5 px-3 font-bold text-on-surface">{"Age "}{row.age}</td>{result.qualifiesForJointLifeTable && <td className="py-2.5 px-3">{"Age "}{row.spouseAge}</td>}<td className="py-2.5 px-3 text-right">{formatCurrency(row.priorYearEndBalance, 0)}</td><td className="py-2.5 px-3 text-right font-mono">{row.distributionPeriod.toFixed(1)}</td><td className="py-2.5 px-3 text-right font-bold text-primary">{formatCurrency(row.rmdAmount, 2)}</td><td className="py-2.5 px-3 text-right">{row.rmdPercentOfBalance.toFixed(2)}%</td><td className="py-2.5 px-3 text-right text-on-surface">{formatCurrency(row.endingBalance, 0)}</td></tr>)}</tbody></table></div>{result.schedule.length > 10 && <div className="pt-2 flex justify-center"><button type="button" onClick={() => setShowFullSchedule(!showFullSchedule)} className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/60 text-xs font-bold text-on-surface flex items-center gap-1.5 transition-colors"><span>{showFullSchedule ? 'Show Fewer Years (First 10 Years)' : `Show All ${result.schedule.length} Projected Years (Through Age ${result.schedule[result.schedule.length - 1]?.age})`}</span>{showFullSchedule ? <ChevronUp className="w-3.5 h-3.5"/> : <ChevronDown className="w-3.5 h-3.5"/>}</button></div>}</div><div className="p-5 sm:p-6 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-4"><div className="flex items-center justify-between"><div><h3 className="text-base font-bold text-on-surface">Verified IRS Uniform Lifetime Table (Table III, IRS Publication 590-B)</h3><p className="text-xs text-on-surface-variant mt-0.5">Official distribution period factors for ages 72 through 120+ under Treas. Reg. § 1.401(a)(9)-9</p></div><button type="button" onClick={() => setShowUniformTableLookup(!showUniformTableLookup)} className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-bold text-on-surface flex items-center gap-1.5 border border-outline-variant/50"><span>{showUniformTableLookup ? 'Hide IRS Table III' : 'View Full IRS Table III'}</span>{showUniformTableLookup ? <ChevronUp className="w-3.5 h-3.5"/> : <ChevronDown className="w-3.5 h-3.5"/>}</button></div>{showUniformTableLookup && <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">{rmdTablesData.factors.map((item) => {
        const pct = (100 / item.distributionPeriod).toFixed(2);
        const isSelected = item.age === result.calculationAge;
        return <div key={item.age} className={`p-2.5 rounded-xl border text-xs tabular-nums ${isSelected ? 'border-primary bg-primary/10 font-bold text-on-surface' : 'border-outline-variant/40 bg-surface-container-low text-on-surface-variant'}`}><div className="flex justify-between items-center"><span className="font-bold text-on-surface">{"Age "}{item.age}</span><span className="text-primary font-mono font-bold">{item.distributionPeriod.toFixed(1)}</span></div><div className="text-[10px] text-on-surface-variant mt-0.5">{pct}% of balance</div></div>;
    })}</div>}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="p-5 sm:p-6 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-3"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400"><Info className="w-4 h-4"/><span>Scope Note: Inherited Accounts (Beneficiary IRAs)</span></div><h3 className="text-base font-bold text-on-surface">Inherited Retirement Accounts Follow Separate IRS Rules</h3><p className="text-xs text-on-surface-variant leading-relaxed">{"This calculator models "}<strong>lifetime Required Minimum Distributions for original account owners</strong>{' '}{"using IRS Publication 590-B "}<strong>Table III (Uniform Lifetime)</strong>{" and"}{' '}<strong>Table II (Joint & Last Survivor)</strong>.</p><p className="text-xs text-on-surface-variant leading-relaxed"><strong>Inherited IRAs and Inherited 401(k) accounts are out of scope</strong>{" for this tool. Under the SECURE Act and SECURE 2.0 final regulations, most non-spouse beneficiaries who inherited accounts in 2020 or later are subject to the "}<strong>10-Year Liquidation Rule</strong>{" (and annual RMDs during years 1–9 if the original owner had already reached their Required Beginning Date), while Eligible Designated Beneficiaries use "}<strong>IRS Table I (Single Life Expectancy)</strong>.</p><div className="pt-2 flex flex-wrap gap-3"><a href="https://www.irs.gov/publications/p590b" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"><span>Official IRS Publication 590-B (Table I & Beneficiary Rules)</span><ExternalLink className="w-3.5 h-3.5"/></a></div></div><div className="p-5 sm:p-6 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-3"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary"><Percent className="w-4 h-4"/><span>Account Aggregation & Plan Rules</span></div><h3 className="text-base font-bold text-on-surface">How RMDs Apply Across IRAs, 401(k)s, and Roth Accounts</h3><ul className="space-y-2 text-xs text-on-surface-variant leading-relaxed"><li><strong className="text-on-surface">Traditional IRAs (SEP & SIMPLE IRAs):</strong>{" You must calculate the RMD separately for each Traditional IRA you own, but you may "}<strong>aggregate the total RMD amount</strong>{' '}and withdraw it from any one or combination of your Traditional IRAs.</li><li><strong className="text-on-surface">401(k) & 457(b) Workplace Plans:</strong>{" RMDs from 401(k) plans"}{' '}<strong>cannot be aggregated</strong>{". Each 401(k) plan's RMD must be calculated and withdrawn separately from that specific plan (note: the “still-working exception” may delay 401(k) RMDs if still employed and owning <5% of the company)."}</li><li><strong className="text-on-surface">Roth IRAs & Designated Roth 401(k)s:</strong>{" Exempt from lifetime RMDs for the original account owner (SECURE 2.0 eliminated pre-death Roth 401(k) RMDs starting in 2024)."}</li></ul></div></div><div className="p-5 sm:p-6 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-4"><h3 className="text-base font-bold text-on-surface">Related Retirement & Tax Calculators</h3><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><Link href="/finance/401k-calculator" className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"><div className="space-y-1"><span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">401(k) Calculator</span><p className="text-[11px] text-on-surface-variant">Model pre-tax deferrals, employer match capture, SECURE 2.0 catch-up limits, and retirement growth.</p></div><ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0 ml-2"/></Link><Link href="/finance/roth-vs-traditional-calculator" className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"><div className="space-y-1"><span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">Roth vs. Traditional Calculator</span><p className="text-[11px] text-on-surface-variant">Compare equal after-tax outlays, break-even retirement tax rates, and RMD exemption benefits.</p></div><ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0 ml-2"/></Link><Link href="/finance/us-federal-income-tax-calculator" className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"><div className="space-y-1"><span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">US Federal Income Tax Calculator</span><p className="text-[11px] text-on-surface-variant">Estimate how ordinary taxable RMD withdrawals interact with federal tax brackets and deductions.</p></div><ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0 ml-2"/></Link></div></div></div>;
}
function CalculatorIcon({ className }) {
    return <Scale className={className}/>;
}
