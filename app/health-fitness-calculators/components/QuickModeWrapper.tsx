'use client';

import React from 'react';
import Link from 'next/link';

interface QuickModeWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  fullPageUrl?: string;
  children: React.ReactNode;
}

export default function QuickModeWrapper({
  isOpen,
  onClose,
  title,
  icon = 'calculate',
  fullPageUrl,
  children,
}: QuickModeWrapperProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-outline-variant/30 text-on-surface relative max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container sticky top-0 bg-surface-container-lowest z-10 pt-2 -mt-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">
              {icon}
            </span>
            <h3 className="font-headline-md text-[18px] font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
          {children}
        </div>

        {fullPageUrl && (
          <div className="pt-4 mt-4 border-t border-surface-container sticky bottom-0 bg-surface-container-lowest z-10 pb-2 -mb-2">
            <Link
              href={fullPageUrl}
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Open Full Page Workbench</span>
              <span className="material-symbols-outlined text-[16px]">
                open_in_new
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
