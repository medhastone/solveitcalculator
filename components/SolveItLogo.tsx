'use client';

import React from 'react';
import Image from 'next/image';

interface SolveItLogoProps {
  className?: string;
  size?: number;
}

export default function SolveItLogo({ className = 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12', size }: SolveItLogoProps) {
  const dimension = size || 80;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <Image
        src="/solveit-1.webp"
        alt="SolveIt Calculator Logo"
        width={dimension}
        height={dimension}
        priority
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain select-none pointer-events-none drop-shadow-sm"
      />
    </div>
  );
}
