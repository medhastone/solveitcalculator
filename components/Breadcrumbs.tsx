import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  rightContent?: React.ReactNode;
  badge?: string;
  className?: string;
}

export default function Breadcrumbs({
  items,
  rightContent,
  badge,
  className = '',
}: BreadcrumbsProps) {
  return (
    <section className={`w-full bg-surface-container-low py-2.5 border-b border-outline-variant/20 shadow-xs ${className}`}>
      <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-wrap items-center justify-between gap-3 text-body-sm font-body-sm text-on-surface-variant">
        <nav aria-label="Breadcrumb" className="flex items-center">
          <ol className="flex items-center gap-1.5 flex-wrap list-none p-0 m-0">
            {items.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === items.length - 1;

              return (
                <li key={item.label + index} className="flex items-center gap-1.5">
                  {!isFirst && (
                    <ChevronRight className="w-3.5 h-3.5 text-outline shrink-0 opacity-70" aria-hidden="true" />
                  )}
                  {isLast || !item.href ? (
                    <span
                      className="text-on-surface font-semibold truncate max-w-[240px] sm:max-w-none"
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="hover:text-primary transition-colors flex items-center gap-1 text-on-surface-variant hover:underline underline-offset-2"
                    >
                      {isFirst && <Home className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {(rightContent || badge) && (
          <div className="flex items-center gap-2 flex-wrap text-label-caps font-label-caps">
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold flex items-center gap-1 text-[11px] tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                {badge}
              </span>
            )}
            {rightContent}
          </div>
        )}
      </div>
    </section>
  );
}
