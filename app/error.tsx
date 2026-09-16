'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App-level error caught:', error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">warning</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-title-lg font-bold text-on-surface">Something went wrong</h2>
          <p className="text-body-md text-on-surface-variant">
            An unexpected error occurred while rendering this page.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
