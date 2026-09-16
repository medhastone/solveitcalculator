'use client';

import React, { useState } from 'react';
import { nPr, nCr } from '../../lib/scientific-evaluator';

interface Props {
  onInsertConstant: (val: string) => void;
}

export default function ReferenceSections({ onInsertConstant }: Props) {
  // Combinatorics mini-sandbox state
  const [comboN, setComboN] = useState<number>(10);
  const [comboR, setComboR] = useState<number>(3);

  const safeN = Math.max(0, Math.min(60, Number(comboN) || 0));
  const safeR = Math.max(0, Math.min(safeN, Number(comboR) || 0));
  const calcP = nPr(safeN, safeR);
  const calcC = nCr(safeN, safeR);

  return (
    <>
      {/* Section 4: Physical Constants Library */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop w-full py-space-xl">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-outline-variant/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">science</span>
                <h2 className="text-headline-md font-headline-md text-on-surface">Universal Mathematical & Physical Constants</h2>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Click any fundamental NIST/CODATA constant to instantly inject its double-precision float value into the current calculation.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-outline">verified</span>
              <span className="text-label-caps font-label-caps text-outline uppercase tracking-wider">CODATA 2024 Reference</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Pi */}
            <button
              type="button"
              className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container hover:shadow-xs text-left transition-all group border border-outline-variant/10 cursor-pointer"
              onClick={() => onInsertConstant('3.141592653589793')}
            >
              <div className="flex items-center justify-between">
                <span className="font-headline-md font-headline-md text-primary group-hover:scale-110 transition-transform">π</span>
                <span className="text-label-caps font-label-caps text-outline uppercase">Archimedes</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface font-semibold mt-1">Archimedes&apos; Constant</p>
              <p className="text-body-sm font-data-mono text-on-surface-variant text-[12px] truncate">3.141592653589793</p>
            </button>

            {/* Euler's e */}
            <button
              type="button"
              className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container hover:shadow-xs text-left transition-all group border border-outline-variant/10 cursor-pointer"
              onClick={() => onInsertConstant('2.718281828459045')}
            >
              <div className="flex items-center justify-between">
                <span className="font-headline-md font-headline-md text-secondary group-hover:scale-110 transition-transform">e</span>
                <span className="text-label-caps font-label-caps text-outline uppercase">Euler Base</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface font-semibold mt-1">Euler&apos;s Number</p>
              <p className="text-body-sm font-data-mono text-on-surface-variant text-[12px] truncate">2.718281828459045</p>
            </button>

            {/* Golden Ratio */}
            <button
              type="button"
              className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container hover:shadow-xs text-left transition-all group border border-outline-variant/10 cursor-pointer"
              onClick={() => onInsertConstant('1.618033988749895')}
            >
              <div className="flex items-center justify-between">
                <span className="font-headline-md font-headline-md text-tertiary-container group-hover:scale-110 transition-transform">φ</span>
                <span className="text-label-caps font-label-caps text-outline uppercase">Divine Ratio</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface font-semibold mt-1">Golden Ratio</p>
              <p className="text-body-sm font-data-mono text-on-surface-variant text-[12px] truncate">1.618033988749895</p>
            </button>

            {/* Speed of Light */}
            <button
              type="button"
              className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container hover:shadow-xs text-left transition-all group border border-outline-variant/10 cursor-pointer"
              onClick={() => onInsertConstant('299792458')}
            >
              <div className="flex items-center justify-between">
                <span className="font-headline-md font-headline-md text-primary group-hover:scale-110 transition-transform">c</span>
                <span className="text-label-caps font-label-caps text-outline uppercase">Exact SI</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface font-semibold mt-1">Speed of Light in Vacuum</p>
              <p className="text-body-sm font-data-mono text-on-surface-variant text-[12px] truncate">299,792,458 m·s⁻¹</p>
            </button>

            {/* Planck Constant */}
            <button
              type="button"
              className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container hover:shadow-xs text-left transition-all group border border-outline-variant/10 cursor-pointer"
              onClick={() => onInsertConstant('6.62607015e-34')}
            >
              <div className="flex items-center justify-between">
                <span className="font-headline-md font-headline-md text-primary group-hover:scale-110 transition-transform">h</span>
                <span className="text-label-caps font-label-caps text-outline uppercase">Quantum Action</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface font-semibold mt-1">Planck&apos;s Constant</p>
              <p className="text-body-sm font-data-mono text-on-surface-variant text-[12px] truncate">6.62607015 × 10⁻³⁴ J·s</p>
            </button>

            {/* Avogadro Constant */}
            <button
              type="button"
              className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container hover:shadow-xs text-left transition-all group border border-outline-variant/10 cursor-pointer"
              onClick={() => onInsertConstant('6.02214076e23')}
            >
              <div className="flex items-center justify-between">
                <span className="font-headline-md font-headline-md text-primary group-hover:scale-110 transition-transform">N_A</span>
                <span className="text-label-caps font-label-caps text-outline uppercase">Mole Definition</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface font-semibold mt-1">Avogadro&apos;s Number</p>
              <p className="text-body-sm font-data-mono text-on-surface-variant text-[12px] truncate">6.02214076 × 10²³ mol⁻¹</p>
            </button>

            {/* Boltzmann Constant */}
            <button
              type="button"
              className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container hover:shadow-xs text-left transition-all group border border-outline-variant/10 cursor-pointer"
              onClick={() => onInsertConstant('1.380649e-23')}
            >
              <div className="flex items-center justify-between">
                <span className="font-headline-md font-headline-md text-primary group-hover:scale-110 transition-transform">k_B</span>
                <span className="text-label-caps font-label-caps text-outline uppercase">Thermal Energy</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface font-semibold mt-1">Boltzmann Constant</p>
              <p className="text-body-sm font-data-mono text-on-surface-variant text-[12px] truncate">1.380649 × 10⁻²³ J·K⁻¹</p>
            </button>

            {/* Gravitational Constant */}
            <button
              type="button"
              className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container hover:shadow-xs text-left transition-all group border border-outline-variant/10 cursor-pointer"
              onClick={() => onInsertConstant('6.67430e-11')}
            >
              <div className="flex items-center justify-between">
                <span className="font-headline-md font-headline-md text-primary group-hover:scale-110 transition-transform">G</span>
                <span className="text-label-caps font-label-caps text-outline uppercase">Newtonian</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface font-semibold mt-1">Newtonian Gravitation</p>
              <p className="text-body-sm font-data-mono text-on-surface-variant text-[12px] truncate">6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²</p>
            </button>
          </div>
        </div>
      </section>

      {/* Section 6: Logarithms & Exponential Mastery Hub */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop w-full py-space-xl">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-outline-variant/20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-label-caps font-label-caps text-secondary uppercase tracking-wider font-semibold">
              <span className="material-symbols-outlined text-[15px]">functions</span>
              <span>Transcendental Mastery</span>
            </div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Logarithms, Natural Bases &amp; Change-of-Base Theorem</h2>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-3xl">
              Logarithmic operators quantify the exponent required to produce a given magnitude. Explore natural base <em>e</em>, common base 10, computational binary 2, and generalized change-of-base laws.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Natural Log */}
            <div className="p-space-md bg-surface-container-low rounded-xl space-y-2 border border-outline-variant/10">
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-label-caps font-label-caps uppercase font-semibold">
                Base e ≈ 2.71828
              </span>
              <h3 className="text-headline-md font-headline-md text-on-surface text-lg font-bold">Natural Logarithm: ln(x)</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Continuous compound growth, calculus derivatives where (d/dx) ln(x) = 1/x.
              </p>
              <div className="p-2 rounded bg-surface-container-lowest font-data-mono text-body-sm text-primary font-semibold">
                ln(e) = 1, ln(1) = 0
              </div>
            </div>

            {/* Common Log */}
            <div className="p-space-md bg-surface-container-low rounded-xl space-y-2 border border-outline-variant/10">
              <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-label-caps font-label-caps uppercase font-semibold">
                Base 10
              </span>
              <h3 className="text-headline-md font-headline-md text-on-surface text-lg font-bold">Common Log: log₁₀(x)</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Used across Richter earthquake scales, sound decibels (dB), and chemistry pH concentrations.
              </p>
              <div className="p-2 rounded bg-surface-container-lowest font-data-mono text-body-sm text-secondary font-semibold">
                log₁₀(1000) = 3
              </div>
            </div>

            {/* Binary Log */}
            <div className="p-space-md bg-surface-container-low rounded-xl space-y-2 border border-outline-variant/10">
              <span className="px-2 py-0.5 rounded bg-tertiary-container/10 text-tertiary text-label-caps font-label-caps uppercase font-semibold">
                Base 2
              </span>
              <h3 className="text-headline-md font-headline-md text-on-surface text-lg font-bold">Binary Log: log₂(x)</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Shannon information entropy, memory addressing bit requirements, and balanced binary trees.
              </p>
              <div className="p-2 rounded bg-surface-container-lowest font-data-mono text-body-sm text-tertiary font-semibold">
                log₂(1024) = 10 bits
              </div>
            </div>

            {/* Change of Base */}
            <div className="p-space-md bg-surface-container-low rounded-xl space-y-2 border border-outline-variant/10">
              <span className="px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant text-label-caps font-label-caps uppercase font-semibold">
                Theorem
              </span>
              <h3 className="text-headline-md font-headline-md text-on-surface text-lg font-bold">Arbitrary Change of Base</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Calculate logarithms of any arbitrary positive base using standard natural logs.
              </p>
              <div className="p-2 rounded bg-surface-container-lowest font-data-mono text-body-sm text-on-surface font-semibold">
                log_b(x) = ln(x) / ln(b)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Combinatorics, Factorials & Probability Suite */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop w-full py-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
          {/* Permutations vs Combinations Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-outline-variant/20">
            <div className="space-y-1">
              <span className="text-label-caps font-label-caps text-primary uppercase tracking-wider font-semibold">
                Combinatorics Architecture
              </span>
              <h2 className="text-headline-lg font-headline-lg text-on-surface">Permutations (nPr) vs Combinations (nCr)</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Understanding ordered permutations versus unordered group combinations.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-space-md bg-surface-container-low rounded-xl space-y-1 border border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <span className="font-headline-md font-headline-md text-on-surface text-base font-bold">
                    Permutation Formula (Order Matters)
                  </span>
                  <span className="font-data-mono text-primary font-bold">nPr = n! / (n - r)!</span>
                </div>
                <p className="text-body-sm text-outline">
                  Arrangements where sequence is distinct (e.g. 1st, 2nd, 3rd podium finishers or lock codes).
                </p>
              </div>

              <div className="p-space-md bg-surface-container-low rounded-xl space-y-1 border border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <span className="font-headline-md font-headline-md text-on-surface text-base font-bold">
                    Combination Formula (Order Irrelevant)
                  </span>
                  <span className="font-data-mono text-secondary font-bold">nCr = n! / [r!(n - r)!]</span>
                </div>
                <p className="text-body-sm text-outline">
                  Subsets where order has no effect (e.g. lottery hand of 6 balls or committee selections).
                </p>
              </div>
            </div>

            {/* Interactive Combinatorics Mini-Sandbox */}
            <div className="p-space-md bg-surface-container rounded-xl space-y-3">
              <span className="text-label-caps font-label-caps text-on-surface-variant uppercase block font-semibold">
                Instant Mini Evaluator
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-label-caps font-label-caps text-outline uppercase block mb-1 font-semibold">
                    Total items (n)
                  </label>
                  <input
                    className="w-full p-2 rounded-lg bg-surface-container-lowest font-data-mono text-body-sm text-on-surface focus:outline-none border border-outline-variant/30"
                    type="number"
                    min="1"
                    max="50"
                    value={comboN}
                    onChange={(e) => setComboN(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-label-caps font-label-caps text-outline uppercase block mb-1 font-semibold">
                    Chosen subset (r)
                  </label>
                  <input
                    className="w-full p-2 rounded-lg bg-surface-container-lowest font-data-mono text-body-sm text-on-surface focus:outline-none border border-outline-variant/30"
                    type="number"
                    min="0"
                    max="50"
                    value={comboR}
                    onChange={(e) => setComboR(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-body-sm font-data-mono">
                <span className="text-on-surface">
                  <sub>{safeN}</sub>P<sub>{safeR}</sub> ={' '}
                  <strong className="text-primary font-bold">{calcP.toLocaleString()}</strong>
                </span>
                <span className="text-on-surface">
                  <sub>{safeN}</sub>C<sub>{safeR}</sub> ={' '}
                  <strong className="text-secondary font-bold">{calcC.toLocaleString()}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Real World Probability & Lottery Case Studies */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md flex flex-col justify-between border border-outline-variant/20">
            <div className="space-y-1">
              <span className="text-label-caps font-label-caps text-secondary uppercase tracking-wider font-semibold">
                Discrete Math Applications
              </span>
              <h3 className="text-headline-lg font-headline-lg text-on-surface">Probability In Action</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Real-world stochastic models calculated via binomial coefficients.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between border border-outline-variant/10">
                <div>
                  <p className="font-headline-md text-on-surface text-body-sm font-bold">Standard Poker Royal Flush</p>
                  <p className="text-outline text-[12px]">4 possible hands out of ₅₂C₅ (2,598,960)</p>
                </div>
                <span className="font-data-mono text-primary font-bold text-body-sm">1 in 649,740</span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between border border-outline-variant/10">
                <div>
                  <p className="font-headline-md text-on-surface text-body-sm font-bold">Powerball Jackpot Probability</p>
                  <p className="text-outline text-[12px]">₆₉C₅ × ₂₆C₁ combinations</p>
                </div>
                <span className="font-data-mono text-tertiary font-bold text-body-sm">1 in 292,201,338</span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between border border-outline-variant/10">
                <div>
                  <p className="font-headline-md text-on-surface text-body-sm font-bold">The Birthday Paradox (23 People)</p>
                  <p className="text-outline text-[12px]">1 - (365! / (365²³ × (365 - 23)!))</p>
                </div>
                <span className="font-data-mono text-secondary font-bold text-body-sm">50.73% Odds</span>
              </div>
            </div>

            <div className="p-3 bg-surface-variant/40 rounded-lg text-on-surface-variant text-[12px] font-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              <span>Computed using arbitrary-precision big integer factorial expansion without truncation.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Scientific & Engineering Notation Converter */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop w-full py-space-xl">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-outline-variant/20">
          <div className="space-y-1">
            <span className="text-label-caps font-label-caps text-primary uppercase tracking-wider font-semibold">
              SI Standard Specifications
            </span>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">
              Scientific vs Engineering Notation &amp; Metric Prefixes
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-3xl">
              Scientific notation constrains mantissas to [1, 10), whereas engineering notation constrains exponents to multiples of 3 (10³ᵏ) matching global SI metric prefixes.
            </p>
          </div>

          {/* Prefix Reference Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-data-mono text-body-sm">
              <thead>
                <tr className="bg-surface-container text-label-caps font-label-caps uppercase text-on-surface-variant font-bold">
                  <th className="p-3 rounded-l-lg">Prefix</th>
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Power of 10</th>
                  <th className="p-3">Decimal Magnitude</th>
                  <th className="p-3 rounded-r-lg">Scientific Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low text-on-surface">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold">Tera</td>
                  <td className="p-3 text-primary font-bold">T</td>
                  <td className="p-3">10¹²</td>
                  <td className="p-3 text-outline">1,000,000,000,000</td>
                  <td className="p-3">1.0 × 10¹² Hz</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold">Giga</td>
                  <td className="p-3 text-primary font-bold">G</td>
                  <td className="p-3">10⁹</td>
                  <td className="p-3 text-outline">1,000,000,000</td>
                  <td className="p-3">3.5 × 10⁹ bytes</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold">Mega</td>
                  <td className="p-3 text-primary font-bold">M</td>
                  <td className="p-3">10⁶</td>
                  <td className="p-3 text-outline">1,000,000</td>
                  <td className="p-3">2.4 × 10⁶ W</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold">Kilo</td>
                  <td className="p-3 text-primary font-bold">k</td>
                  <td className="p-3">10³</td>
                  <td className="p-3 text-outline">1,000</td>
                  <td className="p-3">1.5 × 10³ m</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold">milli</td>
                  <td className="p-3 text-secondary font-bold">m</td>
                  <td className="p-3">10⁻³</td>
                  <td className="p-3 text-outline">0.001</td>
                  <td className="p-3">5.0 × 10⁻³ A</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold">micro</td>
                  <td className="p-3 text-secondary font-bold">μ</td>
                  <td className="p-3">10⁻⁶</td>
                  <td className="p-3 text-outline">0.000001</td>
                  <td className="p-3">2.2 × 10⁻⁶ F</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold">nano</td>
                  <td className="p-3 text-secondary font-bold">n</td>
                  <td className="p-3">10⁻⁹</td>
                  <td className="p-3 text-outline">0.000000001</td>
                  <td className="p-3">6.5 × 10⁻⁹ s</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold">pico</td>
                  <td className="p-3 text-secondary font-bold">p</td>
                  <td className="p-3">10⁻¹²</td>
                  <td className="p-3 text-outline">0.000000000001</td>
                  <td className="p-3">1.0 × 10⁻¹² m</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 9: Expression Parser Architecture & BODMAS/PEMDAS Engine */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop w-full py-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          <div className="lg:col-span-5 space-y-space-sm">
            <div className="inline-flex items-center gap-1.5 text-label-caps font-label-caps text-primary uppercase tracking-wider font-semibold">
              <span className="material-symbols-outlined text-[15px]">account_tree</span>
              <span>Dijkstra Shunting-Yard Engine</span>
            </div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">BODMAS / PEMDAS Order of Operations</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">
              SolveIt Calculator&apos;s client parser processes infix strings into an Abstract Syntax Tree (AST) using Edsger Dijkstra&apos;s Shunting-Yard algorithm, eliminating implicit multiplication ambiguities.
            </p>
            <div className="space-y-2 pt-2 font-body-sm">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-lowest shadow-xs border border-outline-variant/10">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-[12px] shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-on-surface">Parentheses &amp; Brackets:</strong>
                  <span className="text-outline block text-[12px]">(...) evaluated inner-most outwards</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-lowest shadow-xs border border-outline-variant/10">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-[12px] shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-on-surface">Exponents &amp; Radicals:</strong>
                  <span className="text-outline block text-[12px]">xʸ, √x evaluated with right-associativity</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-lowest shadow-xs border border-outline-variant/10">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-[12px] shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-on-surface">Multiplication &amp; Division:</strong>
                  <span className="text-outline block text-[12px]">×, ÷ executed strictly left-to-right</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-lowest shadow-xs border border-outline-variant/10">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-[12px] shrink-0">
                  4
                </span>
                <div>
                  <strong className="text-on-surface">Addition &amp; Subtraction:</strong>
                  <span className="text-outline block text-[12px]">+, − final resolution stage</span>
                </div>
              </div>
            </div>
          </div>

          {/* AST Operator Precedence Visual Graphic */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col items-center justify-center border border-outline-variant/20">
            <span className="text-label-caps font-label-caps text-outline uppercase tracking-wider mb-3 font-semibold">
              AST Parse Graph: `(3 + 5) × 2²`
            </span>
            <div className="w-full max-w-md p-4 rounded-xl bg-surface-container-low font-data-mono text-body-sm text-center space-y-4">
              {/* Root Node */}
              <div className="inline-block px-4 py-1.5 rounded-lg bg-primary text-on-primary font-bold shadow-sm">
                Operator: [ × ]
              </div>
              {/* Branch lines */}
              <div className="grid grid-cols-2 gap-8 text-outline text-[12px]">
                <span>↙ Left Subtree</span>
                <span>Right Subtree ↘</span>
              </div>
              {/* Level 2 Nodes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-2.5 rounded-lg bg-surface-container-lowest shadow-xs space-y-1">
                  <span className="text-secondary font-bold block">Operator: [ + ]</span>
                  <span className="text-[12px] text-on-surface">
                    Nodes: 3, 5 → <strong className="text-primary">8</strong>
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-lowest shadow-xs space-y-1">
                  <span className="text-secondary font-bold block">Operator: [ ^ ]</span>
                  <span className="text-[12px] text-on-surface">
                    Nodes: 2, 2 → <strong className="text-primary">4</strong>
                  </span>
                </div>
              </div>
              {/* Final AST Evaluation */}
              <div className="pt-2 border-t border-outline-variant/20 text-body-sm">
                <span className="text-outline">Terminal AST Multiplier:</span>
                <span className="font-bold text-primary ml-1">8 × 4 = 32</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: High-Value Educational Formulas Reference */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop w-full py-space-xl space-y-space-md">
        <div className="space-y-1">
          <span className="text-label-caps font-label-caps text-primary uppercase tracking-wider font-semibold">
            Quick Formula Cheat Sheet
          </span>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">Fundamental STEM Equations</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Core mathematical models across algebra, geometry, and complex analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {/* Quadratic */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-xs space-y-2 border border-outline-variant/20">
            <span className="text-label-caps font-label-caps text-outline uppercase font-semibold">Algebra</span>
            <h3 className="font-headline-md text-headline-md text-on-surface text-base font-bold">Quadratic Equation</h3>
            <p className="font-data-mono text-primary text-body-sm font-bold">x = (−b ± √(b² − 4ac)) / (2a)</p>
            <p className="text-body-sm text-outline text-[12px]">Determines real or complex roots where ax² + bx + c = 0.</p>
          </div>

          {/* Distance */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-xs space-y-2 border border-outline-variant/20">
            <span className="text-label-caps font-label-caps text-outline uppercase font-semibold">Coordinate Geometry</span>
            <h3 className="font-headline-md text-headline-md text-on-surface text-base font-bold">Euclidean Distance</h3>
            <p className="font-data-mono text-primary text-body-sm font-bold">d = √((x₂ − x₁)² + (y₂ − y₁)²)</p>
            <p className="text-body-sm text-outline text-[12px]">Calculates length between two points in ℝ² cartesian space.</p>
          </div>

          {/* Euler's Identity */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-xs space-y-2 border border-outline-variant/20">
            <span className="text-label-caps font-label-caps text-outline uppercase font-semibold">Complex Analysis</span>
            <h3 className="font-headline-md text-headline-md text-on-surface text-base font-bold">Euler&apos;s Identity</h3>
            <p className="font-data-mono text-secondary text-body-sm font-bold">e^(iπ) + 1 = 0</p>
            <p className="text-body-sm text-outline text-[12px]">Unifies constants 0, 1, e, i, and π in a single expression.</p>
          </div>

          {/* Binomial Theorem */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-xs space-y-2 border border-outline-variant/20">
            <span className="text-label-caps font-label-caps text-outline uppercase font-semibold">Discrete Series</span>
            <h3 className="font-headline-md text-headline-md text-on-surface text-base font-bold">Binomial Theorem</h3>
            <p className="font-data-mono text-primary text-body-sm font-bold">(x + y)ⁿ = ∑ ₙCₖ · xⁿ⁻ᵏ · yᵏ</p>
            <p className="text-body-sm text-outline text-[12px]">Algebraic expansion of powers of a binomial sum.</p>
          </div>

          {/* Relativistic Gamma */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-xs space-y-2 border border-outline-variant/20">
            <span className="text-label-caps font-label-caps text-outline uppercase font-semibold">Astrophysics</span>
            <h3 className="font-headline-md text-headline-md text-on-surface text-base font-bold">Lorentz Factor (γ)</h3>
            <p className="font-data-mono text-primary text-body-sm font-bold">γ = 1 / √(1 − v²/c²)</p>
            <p className="text-body-sm text-outline text-[12px]">Time dilation and relativistic mass increase factor.</p>
          </div>

          {/* Shannon Entropy */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-xs space-y-2 border border-outline-variant/20">
            <span className="text-label-caps font-label-caps text-outline uppercase font-semibold">Information Theory</span>
            <h3 className="font-headline-md text-headline-md text-on-surface text-base font-bold">Shannon Information Entropy</h3>
            <p className="font-data-mono text-secondary text-body-sm font-bold">H(X) = −∑ P(xᵢ) · log₂ P(xᵢ)</p>
            <p className="text-body-sm text-outline text-[12px]">Quantifies average expected information content in bits.</p>
          </div>
        </div>
      </section>

      {/* Section 11: Real-World STEM & Professional Applications */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop w-full py-space-xl">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-outline-variant/20">
          <div className="space-y-1">
            <span className="text-label-caps font-label-caps text-secondary uppercase tracking-wider font-semibold">
              Domain Engineering
            </span>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Professional STEM Domains &amp; Workflows</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">
              How engineers and scientists deploy client-side scientific computation in everyday production tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Electrical */}
            <div className="p-space-md rounded-xl bg-surface-container-low space-y-2 border border-outline-variant/10">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <h3 className="font-headline-md font-headline-md text-on-surface text-base font-bold">Electrical &amp; RF</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Resonant LC frequencies (f = 1 / (2π√LC)), impedance magnitude matching, and decibel attenuator chains.
              </p>
            </div>

            {/* Chemical */}
            <div className="p-space-md rounded-xl bg-surface-container-low space-y-2 border border-outline-variant/10">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">biotech</span>
              </div>
              <h3 className="font-headline-md font-headline-md text-on-surface text-base font-bold">Chemical Kinetics</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Arrhenius equation reaction rates, Henderson-Hasselbalch buffer pH estimations, and molar equilibrium.
              </p>
            </div>

            {/* Aerospace */}
            <div className="p-space-md rounded-xl bg-surface-container-low space-y-2 border border-outline-variant/10">
              <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              </div>
              <h3 className="font-headline-md font-headline-md text-on-surface text-base font-bold">Aerospace Dynamics</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Tsiolkovsky rocket delta-v (v = v_e ln(m₀/m_f)), orbital velocity, and atmospheric re-entry thermal flux.
              </p>
            </div>

            {/* Data Science */}
            <div className="p-space-md rounded-xl bg-surface-container-low space-y-2 border border-outline-variant/10">
              <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">insights</span>
              </div>
              <h3 className="font-headline-md font-headline-md text-on-surface text-base font-bold">Data &amp; Algorithms</h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                Log-loss cross-entropy calculations, Gaussian standard normal probabilities, and Big-O computational time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 12: High-Intent SEO FAQ Accordion */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop w-full py-space-xl space-y-space-md">
        <div className="space-y-1">
          <span className="text-label-caps font-label-caps text-primary uppercase tracking-wider font-semibold">
            Frequently Asked Questions
          </span>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">Expert Scientific Calculation FAQs</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            In-depth technical explanations covering arithmetic accuracy, angle systems, and calculation engines.
          </p>
        </div>

        <div className="space-y-3">
          {/* FAQ 1 */}
          <details className="group bg-surface-container-lowest rounded-xl shadow-xs p-space-md open:bg-surface-container-low/50 transition-colors border border-outline-variant/20">
            <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-on-surface text-base select-none font-bold">
              <span>How does SolveIt Calculator ensure zero floating-point drift and complete client-side privacy?</span>
              <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <p className="text-body-md font-body-md text-on-surface-variant mt-3 pt-2 leading-relaxed">
              Every evaluation executes locally in your browser&apos;s virtual machine using strict IEEE 754-2019 double-precision specifications (64-bit binary floating-point representation with 53-bit significand precision). Because there are no network API calls, your sensitive calculations, cryptographic keys, and proprietary physics variables never touch a remote server.
            </p>
          </details>

          {/* FAQ 2 */}
          <details className="group bg-surface-container-lowest rounded-xl shadow-xs p-space-md open:bg-surface-container-low/50 transition-colors border border-outline-variant/20">
            <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-on-surface text-base select-none font-bold">
              <span>What is the mathematical difference between DEG, RAD, and GRAD angle units?</span>
              <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <p className="text-body-md font-body-md text-on-surface-variant mt-3 pt-2 leading-relaxed">
              A complete circle is partitioned into 360 Degrees (°), 2π Radians (rad), or 400 Gradians (grad). Degrees are traditional in celestial navigation and surveying; Radians are the natural SI metric of calculus because (d/dx) sin(x) = cos(x) only holds true when x is in radians; Gradians are favored in French civil engineering where a 90° right angle corresponds to exactly 100 gradians.
            </p>
          </details>

          {/* FAQ 3 */}
          <details className="group bg-surface-container-lowest rounded-xl shadow-xs p-space-md open:bg-surface-container-low/50 transition-colors border border-outline-variant/20">
            <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-on-surface text-base select-none font-bold">
              <span>How do I evaluate arbitrary base logarithms like log₃(81)?</span>
              <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <p className="text-body-md font-body-md text-on-surface-variant mt-3 pt-2 leading-relaxed">
              Use the universal Change-of-Base formula: log_b(x) = ln(x) / ln(b) = log₁₀(x) / log₁₀(b). For example, to calculate log₃(81), enter <code className="font-data-mono text-primary font-bold">log(81) / log(3)</code> or <code className="font-data-mono text-primary font-bold">ln(81) / ln(3)</code>. Both yield the exact integer <code className="font-data-mono text-on-surface font-bold">4</code>.
            </p>
          </details>

          {/* FAQ 4 */}
          <details className="group bg-surface-container-lowest rounded-xl shadow-xs p-space-md open:bg-surface-container-low/50 transition-colors border border-outline-variant/20">
            <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-on-surface text-base select-none font-bold">
              <span>Why does 0! (zero factorial) evaluate to 1?</span>
              <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <p className="text-body-md font-body-md text-on-surface-variant mt-3 pt-2 leading-relaxed">
              Mathematically, the factorial satisfies the recurrence relation (n - 1)! = n! / n. Setting n = 1 leads directly to 0! = 1! / 1 = 1. Combinatorially, 0! represents the number of distinct ways to arrange zero items (the empty set), which is exactly one configuration. In continuous mathematics, Euler&apos;s Gamma function confirms Γ(1) = 0! = 1.
            </p>
          </details>

          {/* FAQ 5 */}
          <details className="group bg-surface-container-lowest rounded-xl shadow-xs p-space-md open:bg-surface-container-low/50 transition-colors border border-outline-variant/20">
            <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-on-surface text-base select-none font-bold">
              <span>How does the expression parser resolve implicit multiplication (e.g. 2(3+4))?</span>
              <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <p className="text-body-md font-body-md text-on-surface-variant mt-3 pt-2 leading-relaxed">
              SolveIt Calculator&apos;s lexical tokenizer automatically injects an explicit multiplication operator whenever a numeric literal precedes a parenthesis, constant, or transcendental identifier (e.g., <code className="font-data-mono text-primary font-bold">2(4)</code> becomes <code className="font-data-mono text-primary font-bold">2 * 4</code> and <code className="font-data-mono text-primary font-bold">2pi</code> becomes <code className="font-data-mono text-primary font-bold">2 * 3.14159...</code>). This eliminates the syntactic errors commonly encountered on legacy desktop calculators.
            </p>
          </details>

          {/* FAQ 6 */}
          <details className="group bg-surface-container-lowest rounded-xl shadow-xs p-space-md open:bg-surface-container-low/50 transition-colors border border-outline-variant/20">
            <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-on-surface text-base select-none font-bold">
              <span>What is the operational distinction between scientific and engineering notation?</span>
              <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                expand_more
              </span>
            </summary>
            <p className="text-body-md font-body-md text-on-surface-variant mt-3 pt-2 leading-relaxed">
              Scientific notation requires the mantissa (significand) to sit between 1 and 10 (e.g. 4.7 × 10⁴). Engineering notation requires exponents to be constrained to powers divisible by three (10³, 10⁶, 10⁻³, 10⁻⁶), allowing direct substitution with SI metric prefixes such as kilo (k), mega (M), micro (μ), or nano (n). Thus, 4.7 × 10⁴ becomes 47 × 10³ (47 k).
            </p>
          </details>
        </div>
      </section>

      {/* Embedded JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'SoftwareApplication',
                '@id': 'https://solveitcalculator.com/scientific-calculator/#app',
                name: 'SolveIt Calculator Scientific Calculator & Mathematical Workbench',
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'All modern browsers (Client-Side)',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                description:
                  'Client-side high-precision scientific calculator supporting trigonometry, factorials, permutations, logarithms, and live LaTeX formula display.',
              },
              {
                '@type': 'BreadcrumbList',
                '@id': 'https://solveitcalculator.com/scientific-calculator/#breadcrumb',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://solveitcalculator.com/',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Science & Math',
                    item: 'https://solveitcalculator.com/science',
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'Scientific Calculator',
                    item: 'https://solveitcalculator.com/scientific-calculator/',
                  },
                ],
              },
            ],
          }),
        }}
      />
    </>
  );
}
