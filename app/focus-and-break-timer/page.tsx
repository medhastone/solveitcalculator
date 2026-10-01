import React from 'react';
import FocusAndBreakTimerClient from './FocusAndBreakTimerClient';
import { focusTimerMetadata, focusTimerJsonLd } from './focusTimerSchema';

export const metadata = focusTimerMetadata;

export default function FocusAndBreakTimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(focusTimerJsonLd) }}
      />
      <FocusAndBreakTimerClient />
    </>
  );
}

