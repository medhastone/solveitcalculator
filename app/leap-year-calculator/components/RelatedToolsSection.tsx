'use client';

import React from 'react';
import Link from 'next/link';
import { RELATED_TOOLS } from '../utils';

export default function RelatedToolsSection() {
  return (
    <section className="max-w-max-width-canvas mx-auto w-full flex flex-col gap-space-md" id="related-time-date-tools">
      <div>
        <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
          SolveIt Suite
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
          Related Chronometry &amp; Date Tools
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {RELATED_TOOLS.map((tool, idx) => (
          <Link
            key={idx}
            href={tool.href}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all flex items-start gap-space-sm group border border-outline-variant/15"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
              <span className="material-symbols-outlined text-[24px]">{tool.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                {tool.title}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                {tool.desc}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
