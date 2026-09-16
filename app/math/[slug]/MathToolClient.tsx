'use client';

import React, { useState } from 'react';
import { MathToolData } from './data';
import { getToolConfig } from './mathEngine';

interface Props {
  data: MathToolData;
  slug: string;
}

export default function MathToolClient({ data, slug }: Props) {
  const config = getToolConfig(slug);
  const [inputs, setInputs] = useState<Record<string, string>>(
    config.inputs.reduce((acc, input) => {
      acc[input.id] = input.defaultValue || '';
      return acc;
    }, {} as Record<string, string>)
  );
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<React.ReactNode | null>(null);

  const handleCalculate = () => {
    setIsCalculating(true);
    // Simulate minor processing delay for UX (perceived value)
    setTimeout(() => {
      try {
        const res = config.solve(inputs);
        setResult(res);
      } catch (err: any) {
        setResult(<div className="text-error font-semibold">Error: {err.message}</div>);
      }
      setIsCalculating(false);
    }, 400);
  };

  return (
    <main className="flex-1 w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
      
      {/* Left Column: Calculator Tool */}
      <div className="lg:col-span-8 flex flex-col gap-space-lg">
        
        {/* Header Block */}
        <div>
          <h1 className="font-display text-display-sm lg:text-display-md font-bold text-on-surface mb-space-sm tracking-tight">
            {data.h1}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-3xl">
            {data.description}
          </p>
        </div>

        {/* The Calculator Applet */}
        <div className="bg-surface-container rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="font-label-lg text-label-lg font-semibold text-on-surface mb-space-xs">
            Input Parameters
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            {config.inputs.map(input => (
              <div key={input.id} className="flex flex-col gap-space-2xs">
                <label className="font-label-sm text-label-sm font-semibold text-on-surface-variant">
                  {input.label}
                </label>
                {input.type === 'select' ? (
                  <select
                    value={inputs[input.id]}
                    onChange={(e) => setInputs({...inputs, [input.id]: e.target.value})}
                    className="px-space-md py-space-sm bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-on-surface transition-all cursor-pointer h-[46px]"
                  >
                    {input.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={input.type === 'number' ? 'number' : 'text'}
                    step={input.type === 'number' ? 'any' : undefined}
                    value={inputs[input.id]}
                    onChange={(e) => setInputs({...inputs, [input.id]: e.target.value})}
                    placeholder={input.placeholder}
                    className="px-space-md py-space-sm bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-data-mono text-body-lg transition-all h-[46px]"
                  />
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full md:w-auto md:self-start bg-primary text-on-primary px-space-xl py-space-sm rounded-full font-label-lg text-label-lg font-semibold shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-space-sm"
          >
            {isCalculating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Calculating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">calculate</span>
                Calculate Result
              </>
            )}
          </button>

          {result && (
            <div className="mt-space-md bg-surface-container-highest p-space-md rounded-xl border border-outline-variant/40 animate-fade-in">
              <h3 className="font-label-lg text-label-lg font-bold text-on-surface mb-space-sm">Solution:</h3>
              <div className="font-body-md text-on-surface break-words">
                {result}
              </div>
            </div>
          )}
        </div>

        {/* E-E-A-T: Overview & Example */}
        <div className="mt-space-lg flex flex-col gap-space-lg">
          <section>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-space-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              Overview
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {data.overview}
            </p>
          </section>

          {data.formula && (
            <section className="bg-surface-container-low p-space-md rounded-xl border-l-4 border-primary">
              <h3 className="font-label-lg text-label-lg font-bold text-on-surface mb-space-xs">Primary Formula</h3>
              <code className="font-data-mono text-body-lg text-primary block bg-surface p-space-sm rounded border border-outline-variant/20 mt-space-xs">
                {data.formula}
              </code>
            </section>
          )}

          {data.example && (
            <section>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-space-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">school</span>
                Step-by-Step Example
              </h2>
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-md">
                <p className="font-body-md text-body-md font-semibold text-on-surface mb-space-sm">
                  {data.example.question}
                </p>
                <ol className="list-decimal list-inside space-y-space-xs font-body-md text-body-md text-on-surface-variant mb-space-md">
                  {data.example.steps.map((step, idx) => (
                    <li key={idx} className="pl-2">{step}</li>
                  ))}
                </ol>
                <div className="bg-primary-container/30 text-on-primary-container px-space-sm py-space-xs rounded-lg font-semibold text-body-md border border-primary/20">
                  {data.example.answer}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Right Column: E-E-A-T Sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-space-lg">
        {/* How to Use */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">help</span>
            How to Use
          </h3>
          <ul className="space-y-space-sm">
            {data.howToUse.map((step, idx) => (
              <li key={idx} className="flex items-start gap-space-sm">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[12px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQs */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">forum</span>
            Frequently Asked Questions
          </h3>
          <div className="space-y-space-md">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-outline-variant/20 pb-space-sm last:border-0 last:pb-0">
                <h4 className="font-label-lg text-label-lg font-semibold text-on-surface mb-space-2xs">
                  {faq.q}
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trust Badge */}
        <div className="bg-secondary-container/30 border border-secondary/20 rounded-2xl p-space-md flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-secondary text-[32px]">verified_user</span>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface">Verified Calculator</h4>
            <p className="font-body-xs text-body-xs text-on-surface-variant">Algorithms tested against academic standards.</p>
          </div>
        </div>
      </div>
      
    </main>
  );
}
