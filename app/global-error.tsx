'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-6 antialiased font-sans">
        <div className="max-w-md w-full text-center space-y-6 bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">error</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-on-surface">Application Error</h2>
            <p className="text-sm text-on-surface-variant">
              A critical error occurred. Please try reloading the application.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90 transition-opacity"
          >
            Reload application
          </button>
        </div>
      </body>
    </html>
  );
}
