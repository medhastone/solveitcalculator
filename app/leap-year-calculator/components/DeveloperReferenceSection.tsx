'use client';

import React, { useState } from 'react';
import { CODE_SNIPPETS } from '../utils';

export default function DeveloperReferenceSection() {
  const [activeLang, setActiveLang] = useState<string>('js');
  const [copyCodeFeedback, setCopyCodeFeedback] = useState<boolean>(false);

  const handleCopyCode = () => {
    const code = CODE_SNIPPETS[activeLang];
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        setCopyCodeFeedback(true);
        setTimeout(() => setCopyCodeFeedback(false), 2000);
      });
    }
  };

  return (
    <section className="max-w-max-width-canvas mx-auto w-full flex flex-col gap-space-md" id="quick-learning-guide">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div>
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
            QUICK LEARNING GUIDE
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
            Simple Leap Year Rules Explained (No Math Degree Needed)
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            The 3 straightforward steps you can use in your head to check any year in seconds.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md md:p-space-lg flex flex-col gap-space-md border border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-2xs border border-outline-variant/10">
            <span className="font-label-caps text-label-caps text-primary uppercase font-bold">
              Rule 1 • Standard Years
            </span>
            <h4 className="font-headline-md text-body-lg font-bold text-on-surface">
              Most years: Divide by 4
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              If a normal year divides by 4 without a remainder (like 2024, 2028, 2032), it is a leap year with 366 days.
            </p>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-2xs border border-outline-variant/10">
            <span className="font-label-caps text-label-caps text-outline uppercase font-bold">
              Rule 2 • Century Exception
            </span>
            <h4 className="font-headline-md text-body-lg font-bold text-on-surface">
              Years ending in &apos;00&apos;: Stop!
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Turn-of-the-century years (like 1700, 1800, 1900, 2100) are NOT leap years even though they divide by 4.
            </p>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-2xs border border-outline-variant/10">
            <span className="font-label-caps text-label-caps text-primary uppercase font-bold">
              Rule 3 • The 400 Exception
            </span>
            <h4 className="font-headline-md text-body-lg font-bold text-on-surface">
              Divide by 400: Leap Year!
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              If a century year divides cleanly by 400 (like 1600, 2000, 2400), it earns February 29th back!
            </p>
          </div>
        </div>

        {/* Century Years Quick Cheat Sheet */}
        <div className="mt-space-xs p-space-sm rounded-lg bg-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border border-outline-variant/15">
          <div className="flex flex-col">
            <span className="font-body-sm text-body-sm font-bold text-on-surface">
              Century Years Quick Cheat Sheet
            </span>
            <span className="text-[13px] text-on-surface-variant mt-0.5 font-data-mono">
              1600 (Leap) • 1700 (Common) • 1800 (Common) • 1900 (Common) • 2000 (Leap) • 2100 (Common) • 2400 (Leap)
            </span>
          </div>
          <div className="px-space-xs py-1 rounded bg-primary/10 text-primary text-body-sm font-semibold self-start sm:self-center shrink-0">
            Easy Rule of Thumb
          </div>
        </div>

        {/* Developer Pseudocode & Language Implementations */}
        <div className="mt-space-sm flex flex-col gap-space-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1" id="codeLangTabs">
              {[
                { id: 'js', label: 'JavaScript / TypeScript' },
                { id: 'python', label: 'Python' },
                { id: 'php', label: 'PHP' },
                { id: 'java', label: 'Java' },
                { id: 'sql', label: 'SQL (PostgreSQL)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`px-space-sm py-1.5 rounded-md font-body-sm text-body-sm transition-all ${
                    activeLang === tab.id
                      ? 'font-semibold bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                  type="button"
                  onClick={() => setActiveLang(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              className="p-1.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-body-sm font-medium flex items-center gap-1 border border-outline-variant/20 transition-colors"
              id="copyCodeSnippetBtn"
              type="button"
              onClick={handleCopyCode}
            >
              <span className="material-symbols-outlined text-[16px]">
                {copyCodeFeedback ? 'done' : 'content_copy'}
              </span>
              <span>{copyCodeFeedback ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div
            className="p-space-md rounded-lg bg-surface-container-lowest font-data-mono text-body-sm text-on-surface overflow-x-auto border border-outline-variant/20 shadow-xs"
            id="codeSnippetBox"
          >
            <pre className="text-[13px] leading-relaxed">
              <code>{CODE_SNIPPETS[activeLang]}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
