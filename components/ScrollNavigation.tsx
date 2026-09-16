"use client";
import React, { useState, useEffect } from "react";

export default function ScrollNavigation() {
  const [scrollState, setScrollState] = useState({
    showTop: false,
    showBottom: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      
      setScrollState({
        showTop: scrollY > 400,
        showBottom: maxScroll > 800 && scrollY < maxScroll - 400,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Initial check (delay slightly to allow content to render and calculate heights)
    const timeout = setTimeout(handleScroll, 500);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-2 pointer-events-none">
      <button
        onClick={scrollToTop}
        className={`w-11 h-11 bg-surface-container-highest text-on-surface rounded-full shadow-md flex items-center justify-center transition-all duration-300 border border-outline-variant/30 hover:bg-primary hover:text-on-primary hover:shadow-lg focus:outline-none pointer-events-auto ${
          scrollState.showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <span className="material-symbols-outlined text-[24px]">keyboard_arrow_up</span>
      </button>
      
      <button
        onClick={scrollToBottom}
        className={`w-11 h-11 bg-surface-container-highest text-on-surface rounded-full shadow-md flex items-center justify-center transition-all duration-300 border border-outline-variant/30 hover:bg-primary hover:text-on-primary hover:shadow-lg focus:outline-none pointer-events-auto ${
          scrollState.showBottom ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
      >
        <span className="material-symbols-outlined text-[24px]">keyboard_arrow_down</span>
      </button>
    </div>
  );
}
