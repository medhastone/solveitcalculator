import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export const size = {
  width: 64,
  height: 64,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3B82F6 0%, #2457D6 45%, #1A44B8 100%)',
          borderRadius: '16px',
          border: '1.5px solid rgba(255, 255, 255, 0.45)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Display Bar: High-Contrast Pure White Screen */}
          <rect x="8" y="8" width="32" height="10.5" rx="3.5" fill="#FFFFFF" />
          {/* Display Calculation Bar & Verified Node */}
          <rect x="12" y="12.2" width="10" height="2.2" rx="1.1" fill="#2457D6" />
          <circle cx="34" cy="13.3" r="2.2" fill="#10B981" />

          {/* 4 Bold Operator Keycaps */}
          {/* Key 1: (+) */}
          <rect x="8" y="21.5" width="14.5" height="10" rx="3.2" fill="#FFFFFF" />
          <path d="M 15.25 24 L 15.25 29 M 12.75 26.5 L 17.75 26.5" stroke="#2457D6" strokeWidth="2.4" strokeLinecap="round" />

          {/* Key 2: (−) */}
          <rect x="25.5" y="21.5" width="14.5" height="10" rx="3.2" fill="#FFFFFF" />
          <line x1="29.75" y1="26.5" x2="35.75" y2="26.5" stroke="#2457D6" strokeWidth="2.4" strokeLinecap="round" />

          {/* Key 3: (×) */}
          <rect x="8" y="33.5" width="14.5" height="10" rx="3.2" fill="#FFFFFF" />
          <path d="M 13.25 36.5 L 17.25 40.5 M 17.25 36.5 L 13.25 40.5" stroke="#2457D6" strokeWidth="2.4" strokeLinecap="round" />

          {/* Key 4: Emerald (=) SOLVED Key */}
          <rect x="25.5" y="33.5" width="14.5" height="10" rx="3.2" fill="#10B981" />
          <line x1="29.5" y1="37" x2="36" y2="37" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="29.5" y1="40" x2="36" y2="40" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
