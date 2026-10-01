'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Calculator, Ruler, Hash } from 'lucide-react';

export default function ConversionMathPrinciples() {
  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* SECTION 1: EXACT VS ROUNDED FACTORS */}
        <div className="space-y-4">
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Clear Math
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Exact Numbers vs. Rounded Numbers
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Some unit relationships are defined by exact legal standards, while others produce repeating decimals that we round so they are easy to read and use.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-surface border border-emerald-500/25 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Exact Defined Numbers</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Set by official international agreement, with zero rounding error:
              </p>
              <ul className="text-xs text-on-surface space-y-1.5 list-disc pl-4 font-mono">
                <li>1 inch = exactly 2.54 centimeters</li>
                <li>1 pound = exactly 0.45359237 kilograms</li>
                <li>1 minute = exactly 60 seconds</li>
                <li>1 yard = exactly 0.9144 meters</li>
                <li>1 US gallon = exactly 231 cubic inches</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-blue-500/25 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                <Calculator className="w-5 h-5 shrink-0" />
                <span>Rounded for Clean Reading</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                These divisions produce unending decimals, so we round them neatly on screen:
              </p>
              <ul className="text-xs text-on-surface space-y-1.5 list-disc pl-4 font-mono">
                <li>1 kilogram ≈ 2.20462 pounds (1 ÷ 0.45359...)</li>
                <li>1 meter ≈ 3.28084 feet (1 ÷ 0.3048)</li>
                <li>1 kilometer ≈ 0.62137 miles</li>
                <li>1 horsepower ≈ 745.70 Watts</li>
                <li>1 radian ≈ 57.2958 degrees (180 ÷ π)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 2: NOT EVERY CONVERSION USES THE SAME FORMULA */}
        <div className="space-y-4 pt-4 border-t border-outline-variant/15">
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            How Conversions Work
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Four Simple Ways Units Are Converted
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Different kinds of measurements work differently. Here are the 4 main ways our tools calculate your answers:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 space-y-2">
              <div className="text-xs font-bold text-primary uppercase">1. Direct Multiply</div>
              <div className="font-mono text-xs font-bold text-on-surface">answer = value × factor</div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Simple scaling where doubling the input doubles the output. E.g., meters to centimeters (1 m = 100 cm).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 space-y-2">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">2. Shift &amp; Scale</div>
              <div className="font-mono text-xs font-bold text-on-surface">°F = (°C × 9/5) + 32</div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Used for temperatures where water freezes at 0°C but 32°F, requiring both multiplying and adding an offset.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 space-y-2">
              <div className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">3. Inverse / Flip</div>
              <div className="font-mono text-xs font-bold text-on-surface">L/100km = 235.215 / MPG</div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Used for gas mileage where higher MPG means fewer liters used per 100 kilometers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 space-y-2">
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">4. Ingredient Density</div>
              <div className="font-mono text-xs font-bold text-on-surface">grams = cups × density</div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Converting kitchen weight into cups depends on what you are measuring: 1 cup of sugar weighs ~204g, while flour weighs ~127g.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: DIMENSIONAL ANALYSIS & SIGNIFICANT FIGURES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline-variant/15">
          <div className="p-6 rounded-2xl bg-surface border border-outline-variant/25 space-y-3">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Ruler className="w-5 h-5 text-primary shrink-0" />
              <span>Comparing the Right Things (Like for Like)</span>
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Conversions only work between units of the same type:
            </p>
            <ul className="text-xs text-on-surface space-y-1 list-disc pl-4 font-mono">
              <li>Length to Length: feet to meters, inches to cm</li>
              <li>Area to Area: square feet to square meters (factors are squared)</li>
              <li>Volume to Volume: gallons to liters (factors are cubed)</li>
            </ul>
            <p className="text-[11px] text-on-surface-variant italic">
              You cannot directly convert speed into weight, or time into distance, without extra information like how long someone traveled.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-outline-variant/25 space-y-3">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary shrink-0" />
              <span>Rounding &amp; Decimal Places</span>
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Showing 10 decimal places is usually more detail than needed for cooking or home projects.
            </p>
            <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface">Helpful Tip: </span>
              Our tools calculate everything with full accuracy behind the scenes, and you can switch between 2, 4, 6, or automatic decimals anytime with a click.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
