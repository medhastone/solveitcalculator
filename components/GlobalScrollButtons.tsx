'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function GlobalScrollButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const viewportHeight = window.innerHeight;
          const totalHeight = document.documentElement.scrollHeight;

          // Reveal buttons once user has scrolled past 200px
          setIsVisible(scrollY > 200);

          // Check if user is within 80px of the page bottom
          setIsNearBottom(scrollY + viewportHeight >= totalHeight - 80);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial evaluation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <aside
      aria-label="Page scroll controls"
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center bg-surface-container-high/95 backdrop-blur-md border border-outline-variant/50 rounded-2xl shadow-xl p-1 gap-1">
        {/* Scroll To Top Button */}
        <button
          type="button"
          onClick={scrollToTop}
          className="p-2 sm:p-2.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-all duration-150 cursor-pointer active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title="Scroll to top of page"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
        </button>

        {/* Subtle Divider */}
        <div className="w-4 h-px bg-outline-variant/40" />

        {/* Scroll To Bottom Button */}
        <button
          type="button"
          onClick={scrollToBottom}
          className={`p-2 sm:p-2.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            isNearBottom
              ? 'text-on-surface-variant/40 hover:text-on-surface-variant'
              : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-highest'
          }`}
          title="Scroll to bottom of page"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-y-0.5" />
        </button>
      </div>
    </aside>
  );
}
