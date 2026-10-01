'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Tag,
  Cake,
  BadgeDollarSign,
  Repeat,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

type SolverTab = 'discount' | 'age' | 'loan' | 'unit';

export default function QuickEverydaySolver() {
  const [activeTab, setActiveTab] = useState<SolverTab>('discount');

  // Tab 1: Discount State
  const [price, setPrice] = useState<string>('80');
  const [discountPercent, setDiscountPercent] = useState<string>('20');

  // Tab 2: Birthday State (Default: 30 years ago)
  const [birthDate, setBirthDate] = useState<string>('1995-05-15');

  // Tab 3: Simple Loan State
  const [loanAmount, setLoanAmount] = useState<string>('10000');
  const [loanRate, setLoanRate] = useState<string>('6.5');
  const [loanYears, setLoanYears] = useState<string>('3');

  // Tab 4: Quick Unit Converter State
  const [unitMode, setUnitMode] = useState<'ft_m' | 'lb_kg' | 'c_f'>('ft_m');
  const [unitInput, setUnitInput] = useState<string>('10');

  // 1. Discount Calculation
  const discountResult = useMemo(() => {
    const p = parseFloat(price);
    const d = parseFloat(discountPercent);
    if (isNaN(p) || p < 0 || isNaN(d) || d < 0) {
      return { finalPrice: '0.00', saved: '0.00', valid: false };
    }
    const discountAmount = (p * Math.min(d, 100)) / 100;
    const finalP = Math.max(0, p - discountAmount);
    return {
      finalPrice: finalP.toFixed(2),
      saved: discountAmount.toFixed(2),
      valid: true,
    };
  }, [price, discountPercent]);

  // 2. Age Calculation
  const ageResult = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate + 'T00:00:00');
    const now = new Date();
    if (isNaN(birth.getTime()) || birth > now) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Days until next birthday
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }
    const diffTime = nextBday.getTime() - now.getTime();
    const daysUntilNext = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { years, months, days, daysUntilNext };
  }, [birthDate]);

  // 3. Simple Loan Calculation
  const loanResult = useMemo(() => {
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(loanRate);
    const years = parseFloat(loanYears);

    if (isNaN(P) || P <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(years) || years <= 0) {
      return null;
    }

    const n = years * 12;
    const r = annualRate / 100 / 12;

    if (r === 0) {
      const monthly = P / n;
      return {
        monthly: monthly.toFixed(2),
        totalInterest: '0.00',
        totalPayment: P.toFixed(2),
      };
    }

    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthly * n;
    const totalInterest = totalPayment - P;

    return {
      monthly: monthly.toFixed(2),
      totalInterest: Math.max(0, totalInterest).toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    };
  }, [loanAmount, loanRate, loanYears]);

  // 4. Quick Unit Calculation
  const unitResult = useMemo(() => {
    const val = parseFloat(unitInput);
    if (isNaN(val)) return null;

    switch (unitMode) {
      case 'ft_m': {
        const meters = val * 0.3048;
        return {
          fromLabel: `${val} feet`,
          toLabel: `${meters.toFixed(2)} meters`,
          explanation: '1 foot = 0.3048 meters',
        };
      }
      case 'lb_kg': {
        const kg = val * 0.45359237;
        return {
          fromLabel: `${val} pounds (lbs)`,
          toLabel: `${kg.toFixed(2)} kilograms (kg)`,
          explanation: '1 pound = 0.4536 kg',
        };
      }
      case 'c_f': {
        const fahrenheit = (val * 9) / 5 + 32;
        return {
          fromLabel: `${val}° Celsius`,
          toLabel: `${fahrenheit.toFixed(1)}° Fahrenheit`,
          explanation: 'Formula: (°C × 9/5) + 32',
        };
      }
    }
  }, [unitInput, unitMode]);

  return (
    <section className="w-full my-6 bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-sm p-4 sm:p-6 text-left max-w-4xl mx-auto transition-all">
      {/* Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Quick Solver</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-on-surface">
            Try a Quick Everyday Calculation Right Now
          </h2>
          <p className="text-xs text-on-surface-variant">
            Type your numbers below for instant answers. No page reloads or sign-ups required.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('discount')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'discount'
                ? 'bg-surface text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Sale Discount</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('age')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'age'
                ? 'bg-surface text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Cake className="w-3.5 h-3.5" />
            <span>Exact Age</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('loan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'loan'
                ? 'bg-surface text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <BadgeDollarSign className="w-3.5 h-3.5" />
            <span>Loan Payment</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('unit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              activeTab === 'unit'
                ? 'bg-surface text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Quick Convert</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Discount & Savings */}
      {activeTab === 'discount' && (
        <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Original Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-on-surface-variant text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="80"
                    className="w-full pl-7 pr-3 py-2 bg-surface border border-outline-variant/40 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Discount (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="20"
                    className="w-full px-3 py-2 bg-surface border border-outline-variant/40 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:border-primary pr-7"
                  />
                  <span className="absolute right-3 top-2.5 text-on-surface-variant text-sm">%</span>
                </div>
              </div>
            </div>

            {/* Preset percentage quick buttons */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
              <span className="text-on-surface-variant text-[11px] font-medium mr-1">Quick Picks:</span>
              {['10', '15', '20', '25', '30', '50'].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDiscountPercent(pct)}
                  className={`px-2 py-0.5 rounded-lg border text-[11px] font-medium cursor-pointer transition-colors ${
                    discountPercent === pct
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/30 text-on-surface'
                  }`}
                >
                  {pct}% OFF
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/40 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs text-on-surface-variant font-medium block">
                Final Sale Price
              </span>
              <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                ${discountResult.finalPrice}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>You save ${discountResult.saved}</span>
              </div>
            </div>

            <Link
              href="/percentage-calculator"
              className="inline-flex items-center justify-between text-xs font-bold text-primary hover:underline pt-2 border-t border-outline-variant/20"
            >
              <span>More percentage &amp; tax options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab 2: Exact Age & Birthday */}
      {activeTab === 'age' && (
        <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-7 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Choose Your Date of Birth
              </label>
              <input
                type="date"
                value={birthDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-outline-variant/40 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Find out your exact age down to the day, plus how many days are left until your next celebration.
            </p>
          </div>

          <div className="md:col-span-5 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/40 flex flex-col justify-between space-y-3">
            {ageResult ? (
              <div>
                <span className="text-xs text-on-surface-variant font-medium block">
                  Your Exact Age
                </span>
                <div className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                  {ageResult.years} yrs, {ageResult.months} mos, {ageResult.days} days
                </div>
                <div className="text-xs text-on-surface-variant font-medium mt-1">
                  🎉 Next birthday in <strong className="text-on-surface">{ageResult.daysUntilNext} days</strong>
                </div>
              </div>
            ) : (
              <div className="text-xs text-on-surface-variant">Please choose a valid birth date.</div>
            )}

            <Link
              href="/time-date/age-calculator"
              className="inline-flex items-center justify-between text-xs font-bold text-primary hover:underline pt-2 border-t border-outline-variant/20"
            >
              <span>See hours, minutes &amp; weekdays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab 3: Simple Loan Payment */}
      {activeTab === 'loan' && (
        <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface mb-1">
                  Loan Amount ($)
                </label>
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="10000"
                  className="w-full px-2.5 py-1.5 bg-surface border border-outline-variant/40 rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={loanRate}
                  onChange={(e) => setLoanRate(e.target.value)}
                  placeholder="6.5"
                  className="w-full px-2.5 py-1.5 bg-surface border border-outline-variant/40 rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface mb-1">
                  Duration (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={loanYears}
                  onChange={(e) => setLoanYears(e.target.value)}
                  placeholder="3"
                  className="w-full px-2.5 py-1.5 bg-surface border border-outline-variant/40 rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-on-surface-variant text-[11px] font-medium mr-1">Term:</span>
              {[
                { label: '1 Year', val: '1' },
                { label: '3 Years', val: '3' },
                { label: '5 Years', val: '5' },
                { label: '15 Yrs (Mortgage)', val: '15' },
                { label: '30 Yrs (Mortgage)', val: '30' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setLoanYears(opt.val)}
                  className={`px-2 py-0.5 rounded-lg border text-[11px] font-medium cursor-pointer transition-colors ${
                    loanYears === opt.val
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/30 text-on-surface'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/40 flex flex-col justify-between space-y-3">
            {loanResult ? (
              <div>
                <span className="text-xs text-on-surface-variant font-medium block">
                  Estimated Monthly Payment
                </span>
                <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                  ${loanResult.monthly}
                  <span className="text-xs font-normal text-on-surface-variant"> / month</span>
                </div>
                <div className="text-xs text-on-surface-variant font-medium mt-1">
                  Total Interest: <strong>${loanResult.totalInterest}</strong>
                </div>
              </div>
            ) : (
              <div className="text-xs text-on-surface-variant">Enter numbers to see your payment.</div>
            )}

            <Link
              href="/finance/mortgage-calculator"
              className="inline-flex items-center justify-between text-xs font-bold text-primary hover:underline pt-2 border-t border-outline-variant/20"
            >
              <span>Full amortization &amp; tax schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab 4: Quick Unit Converter */}
      {activeTab === 'unit' && (
        <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'ft_m', label: 'Feet ➔ Meters' },
                { id: 'lb_kg', label: 'Pounds ➔ Kilograms' },
                { id: 'c_f', label: 'Celsius ➔ Fahrenheit' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setUnitMode(m.id as any)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    unitMode === m.id
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/30 text-on-surface'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">
                Enter Amount to Convert
              </label>
              <input
                type="number"
                step="any"
                value={unitInput}
                onChange={(e) => setUnitInput(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 bg-surface border border-outline-variant/40 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="md:col-span-5 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/40 flex flex-col justify-between space-y-3">
            {unitResult ? (
              <div>
                <span className="text-xs text-on-surface-variant font-medium block">
                  Converted Result
                </span>
                <div className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                  {unitResult.toLabel}
                </div>
                <div className="text-xs text-on-surface-variant font-medium mt-1">
                  {unitResult.explanation}
                </div>
              </div>
            ) : (
              <div className="text-xs text-on-surface-variant">Enter a number to convert.</div>
            )}

            <Link
              href="/conversions"
              className="inline-flex items-center justify-between text-xs font-bold text-primary hover:underline pt-2 border-t border-outline-variant/20"
            >
              <span>Explore 50+ conversion tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
