'use client';

import React from 'react';
import Image from 'next/image';

interface SolveItLogoProps {
  className?: string;
  size?: number;
}

export default function SolveItLogo({ className = 'w-[52px] h-[52px] sm:w-[60px] sm:h-[60px]', size }: SolveItLogoProps) {
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
