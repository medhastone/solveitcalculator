'use client';

import React from 'react';
import { LeapYearEvaluation } from '../types';

interface DecisionTreeSectionProps {
  evaluation: LeapYearEvaluation;
}

export default function DecisionTreeSection({ evaluation }: DecisionTreeSectionProps) {
  const { year, isDiv400, isDiv100, isDiv4, ruleIndex } = evaluation;

  return (
    <section className="max-w-max-width-canvas mx-auto w-full flex flex-col gap-space-md" id="leap-year-rule-tree">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs">
        <div>
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
            THE 3-STEP LEAP YEAR RULE
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            How the Leap Year Rule Works Step by Step
          </h2>
        </div>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Path highlighted for year <span className="font-bold text-on-surface" id="flowTargetYear">{year}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* Flow Step 1: 400 */}
        <div
          className={`p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden transition-all border border-outline-variant/15 ${
            ruleIndex === 1 ? 'shadow-[0_0_0_2px_#2563eb] bg-primary/5' : ''
          }`}
          id="flowCard400"
        >
          <div className="flex flex-col gap-space-2xs">
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-0.5 rounded-full font-data-mono text-[11px] font-bold ${
                  ruleIndex === 1 ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                Step 1 {ruleIndex === 1 && '• Triggered'}
              </span>
              <span
                className={`font-label-caps text-label-caps uppercase ${
                  ruleIndex === 1 ? 'text-primary font-bold' : 'text-outline'
                }`}
                id="flowBadge400"
              >
                {ruleIndex === 1 ? 'Rule 1 Applied: Century Leap!' : 'Checked'}
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">
              Divisible by 400?
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Century years like 1600, 2000, 2400 bypass all further checks and are{' '}
              <strong className="text-on-surface">immediately classified as leap years</strong>.
            </p>
          </div>
          <div
            className={`p-space-xs rounded-lg font-data-mono text-body-sm flex items-center justify-between ${
              ruleIndex === 1 ? 'bg-primary/10' : 'bg-surface-container-low'
            }`}
          >
            <span className={ruleIndex === 1 ? 'text-primary font-medium' : 'text-on-surface-variant'}>
              Year % 400 === 0
            </span>
            <span
              className={`font-bold ${ruleIndex === 1 ? 'text-primary' : 'text-outline'}`}
              id="flowResult400"
            >
              {isDiv400 ? 'true (Divisible by 400)' : `false (Remainder: ${year % 400})`}
            </span>
          </div>
        </div>

        {/* Flow Step 2: 100 */}
        <div
          className={`p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden transition-all border border-outline-variant/15 ${
            ruleIndex === 2 ? 'shadow-[0_0_0_2px_#2563eb] bg-primary/5' : ''
          }`}
          id="flowCard100"
        >
          <div className="flex flex-col gap-space-2xs">
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-0.5 rounded-full font-data-mono text-[11px] font-bold ${
                  ruleIndex === 2 ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                Step 2 {ruleIndex === 2 && '• Triggered'}
              </span>
              <span
                className={`font-label-caps text-label-caps uppercase ${
                  ruleIndex === 2 ? 'text-primary font-bold' : 'text-outline'
                }`}
                id="flowBadge100"
              >
                {ruleIndex === 2 ? 'Rule 2 Applied: Century Non-Leap' : 'Checked'}
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">
              Divisible by 100?
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              If not divisible by 400, century turnarounds like 1700, 1800, 1900, 2100 are{' '}
              <strong className="text-on-surface">common years (365 days)</strong>.
            </p>
          </div>
          <div
            className={`p-space-xs rounded-lg font-data-mono text-body-sm flex items-center justify-between ${
              ruleIndex === 2 ? 'bg-primary/10' : 'bg-surface-container-low'
            }`}
          >
            <span className={ruleIndex === 2 ? 'text-primary font-medium' : 'text-on-surface-variant'}>
              Year % 100 === 0
            </span>
            <span
              className={`font-bold ${ruleIndex === 2 ? 'text-primary' : 'text-outline'}`}
              id="flowResult100"
            >
              {isDiv100 ? 'true (Century Year)' : 'false (Not century)'}
            </span>
          </div>
        </div>

        {/* Flow Step 3: 4 */}
        <div
          className={`p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden transition-all border border-outline-variant/15 ${
            ruleIndex === 3 || ruleIndex === 4 ? 'shadow-[0_0_0_2px_#2563eb] bg-primary/5' : ''
          }`}
          id="flowCard4"
        >
          <div className="flex flex-col gap-space-2xs">
            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-0.5 rounded-full font-data-mono text-[11px] font-bold ${
                  ruleIndex >= 3 ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface'
                }`}
              >
                Step 3 {ruleIndex >= 3 && '• Triggered'}
              </span>
              <span
                className={`font-label-caps text-label-caps uppercase ${
                  ruleIndex === 3 ? 'text-primary font-bold' : 'text-outline'
                }`}
                id="flowBadge4"
              >
                {ruleIndex === 3 ? 'Rule 3 Applied: Leap Year!' : ruleIndex === 4 ? 'Rule 4: Common Year' : 'Checked'}
              </span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">
              Divisible by 4?
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Every year evenly divisible by 4 that is not an exempted century year is a standard{' '}
              <strong className="text-on-surface">quadrennial leap year</strong>.
            </p>
          </div>
          <div
            className={`p-space-xs rounded-lg font-data-mono text-body-sm flex items-center justify-between ${
              ruleIndex >= 3 ? 'bg-primary/10' : 'bg-surface-container-low'
            }`}
          >
            <span className={ruleIndex >= 3 ? 'text-primary font-medium' : 'text-on-surface-variant'}>
              Year % 4 === 0
            </span>
            <span
              className={`font-bold ${ruleIndex === 3 ? 'text-primary' : 'text-outline'}`}
              id="flowResult4"
            >
              {isDiv4 ? 'true (Divisible by 4)' : `false (Remainder: ${year % 4})`}
            </span>
          </div>
        </div>
      </div>

      {/* Contrast Card: Why 2000 was leap but 1900 was not */}
      <div className="p-space-md md:p-space-lg rounded-xl bg-surface-container-low flex flex-col md:flex-row gap-space-lg items-center border border-outline-variant/20">
        <div className="flex-1 flex flex-col gap-space-xs">
          <span className="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps uppercase w-max font-semibold">
            DID YOU KNOW?
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
            The Century Rule: Why 2000 Was a Leap Year, but 1900 Was Not
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Most people think every 4th year is automatically a leap year. But century years (years ending in 00) must also divide evenly by 400. That is why 2000 had February 29th, while 1900 was a regular 365-day year. The next century year, 2100, will also not be a leap year!
          </p>
        </div>
        <div className="w-full md:w-auto grid grid-cols-2 gap-space-sm shrink-0">
          <div className="p-space-sm rounded-lg bg-surface-container-lowest shadow-sm flex flex-col border border-outline-variant/15">
            <span className="font-numerical-display text-[28px] font-bold text-outline">1900</span>
            <span className="text-[12px] font-semibold text-error uppercase mt-1">Common Year</span>
            <span className="text-[11px] text-on-surface-variant mt-1">1900 ÷ 400 has remainder</span>
            <span className="text-[11px] text-outline mt-0.5">Feb had 28 days</span>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-lowest shadow-sm flex flex-col border border-primary/20">
            <span className="font-numerical-display text-[28px] font-bold text-primary">2000</span>
            <span className="text-[12px] font-semibold text-primary uppercase mt-1">Century Leap Year</span>
            <span className="text-[11px] text-on-surface-variant mt-1">2000 ÷ 400 divides evenly</span>
            <span className="text-[11px] text-primary font-semibold mt-0.5">Feb had 29 days</span>
          </div>
        </div>
      </div>
    </section>
  );
}
