import React from 'react';
import FocusAndBreakTimerClient from '../focus-and-break-timer/FocusAndBreakTimerClient';
import { focusTimerMetadata, focusTimerJsonLd } from '../focus-and-break-timer/focusTimerSchema';

export const metadata = focusTimerMetadata;

export default function FocusAndBreakTimersPage() {
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

