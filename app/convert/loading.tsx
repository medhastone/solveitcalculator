import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-outline-variant/30 border-t-primary rounded-full animate-spin"></div>
        <p className="font-body-md text-on-surface-variant font-medium">Loading Conversion Directory...</p>
      </div>
    </div>
  );
}
