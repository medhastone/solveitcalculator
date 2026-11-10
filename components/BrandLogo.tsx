import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

interface BrandLogoProps {
  variant?: 'navbar' | 'footer' | 'compact';
  href?: string;
  className?: string;
}

/**
 * Official SolveItCalculator Brand Emblem: "Verified Modern Calculator"
 * Selected brand identity featuring:
 * - Signature Royal Blue (#2457D6) squircle base
 * - High-contrast white digital display screen with live calculation accent
 * - 4 bold, chunky operator keycaps (+, −, ×)
 * - Signature radiant Emerald Green (#10B981) "=" Solved key
 */
export function BrandMark({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const pixelSize = size === 'lg' ? 44 : size === 'sm' ? 30 : 36;
  const idSuffix = size;

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 group-hover:scale-[1.03] select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Vibrant Royal Blue matching site theme (#2457D6) */}
        <linearGradient
          id={`calc_bg_${idSuffix}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="45%" stopColor="#2457D6" />
          <stop offset="100%" stopColor="#1A44B8" />
        </linearGradient>

        {/* Radiant Emerald Solved Key (#10B981) */}
        <linearGradient
          id={`calc_emerald_${idSuffix}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Bezel Highlight Rim */}
        <linearGradient
          id={`calc_rim_${idSuffix}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Squircle Base (Signature Shape) */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="12"
        fill={`url(#calc_bg_${idSuffix})`}
      />
      <rect
        x="2.6"
        y="2.6"
        width="42.8"
        height="42.8"
        rx="11.4"
        stroke={`url(#calc_rim_${idSuffix})`}
        strokeWidth="1.2"
      />

      {/* Top Display Bar: High-Contrast Pure White Screen */}
      <rect x="8" y="8" width="32" height="10.5" rx="3.5" fill="#FFFFFF" />
      {/* Display Formula / Result Accent: Sleek Blue Calculation Bar & Emerald Verified Node */}
      <rect
        x="12"
        y="12.2"
        width="10"
        height="2.2"
        rx="1.1"
        fill="#2457D6"
      />
      <circle cx="34" cy="13.3" r="2.2" fill="#10B981" />

      {/* 4 Bold Operator Keycaps (Clear, High-Contrast, Zero Clutter) */}
      {/* Key 1: Top-Left (+) */}
      <rect
        x="8"
        y="21.5"
        width="14.5"
        height="10"
        rx="3.2"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      <path
        d="M 15.25 24 L 15.25 29 M 12.75 26.5 L 17.75 26.5"
        stroke="#2457D6"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Key 2: Top-Right (−) */}
      <rect
        x="25.5"
        y="21.5"
        width="14.5"
        height="10"
        rx="3.2"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      <line
        x1="29.75"
        y1="26.5"
        x2="35.75"
        y2="26.5"
        stroke="#2457D6"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Key 3: Bottom-Left (×) */}
      <rect
        x="8"
        y="33.5"
        width="14.5"
        height="10"
        rx="3.2"
        fill="#FFFFFF"
        fillOpacity="0.95"
      />
      <path
        d="M 13.25 36.5 L 17.25 40.5 M 17.25 36.5 L 13.25 40.5"
        stroke="#2457D6"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Key 4: Bottom-Right Signature Emerald (=) SOLVED Key */}
      <rect
        x="25.5"
        y="33.5"
        width="14.5"
        height="10"
        rx="3.2"
        fill={`url(#calc_emerald_${idSuffix})`}
      />
      <line
        x1="29.5"
        y1="37"
        x2="36"
        y2="37"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <line
        x1="29.5"
        y1="40"
        x2="36"
        y2="40"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BrandLogo({
  variant = 'navbar',
  href = '/',
  className = '',
}: BrandLogoProps) {
  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3.5 ${className}`}>
        <Link
          href={href}
          aria-label="SolveItCalculator Home"
          className="group inline-flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xl"
        >
          <BrandMark size="lg" />
          <div className="flex flex-col">
            <span
              data-no-translate="true"
              className="text-[21px] sm:text-[23px] font-extrabold tracking-[-0.035em] leading-none text-[#152238]"
            >
              SolveIt<span className="text-[#2457D6]">Calculator</span>
            </span>
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold tracking-tight text-[#475569]">
              <ShieldCheck
                className="w-3.5 h-3.5 text-[#10B981] shrink-0"
                aria-hidden="true"
              />
              <span>Verified Formulas &amp; Decision Tools</span>
            </span>
          </div>
        </Link>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        aria-label="SolveItCalculator Home"
        className={`group inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-lg ${className}`}
      >
        <BrandMark size="sm" />
        <span
          data-no-translate="true"
          className="text-[19px] font-extrabold tracking-[-0.035em] text-[#152238]"
        >
          SolveIt<span className="text-[#2457D6]">Calculator</span>
        </span>
      </Link>
    );
  }

  // Default: 'navbar' (Strict 1-line Top Bar Contract compliant)
  return (
    <Link
      href={href}
      aria-label="SolveItCalculator Home"
      className={`group flex items-center gap-2.5 sm:gap-3 whitespace-nowrap shrink-0 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xl ${className}`}
    >
      <BrandMark size="md" />
      <span
        data-no-translate="true"
        className="text-[18px] sm:text-[22px] font-extrabold tracking-[-0.035em] text-[#152238]"
      >
        SolveIt<span className="text-[#2457D6]">Calculator</span>
      </span>
    </Link>
  );
}
