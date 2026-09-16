"use client";

import React, { useState, useEffect } from "react";
import { isToolSaved, toggleSaveTool, SavedTool } from "../lib/bookmarks";

interface SaveButtonProps {
  tool: {
    id: string;
    title: string;
    link: string;
    category?: string;
    label?: string;
    desc?: string;
    badgeClass?: string;
  };
  variant?: "icon" | "pill" | "button";
  className?: string;
  onToggle?: (isSaved: boolean) => void;
}

export default function SaveButton({
  tool,
  variant = "pill",
  className = "",
  onToggle,
}: SaveButtonProps) {
  const [saved, setSaved] = useState<boolean>(false);
  const [justToggled, setJustToggled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      setSaved(isToolSaved(tool.id || tool.link));
    };

    check();

    window.addEventListener("solveit-bookmarks-change", check);
    window.addEventListener("storage", check);

    return () => {
      window.removeEventListener("solveit-bookmarks-change", check);
      window.removeEventListener("storage", check);
    };
  }, [tool.id, tool.link]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = toggleSaveTool(tool);
    setSaved(nextSaved);
    setJustToggled(true);
    if (onToggle) {
      onToggle(nextSaved);
    }
    setTimeout(() => setJustToggled(false), 1200);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={saved ? `Remove ${tool.title} from saved tools` : `Save ${tool.title}`}
        title={saved ? "Saved in Bookmarks" : "Save this Tool"}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
          saved
            ? "bg-primary text-on-primary border-primary shadow-xs"
            : "bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container-high border-outline-variant/30"
        } ${justToggled ? "scale-110" : ""} ${className}`}
      >
        <span className="material-symbols-outlined text-[19px]">
          {saved ? "bookmark" : "bookmark_border"}
        </span>
      </button>
    );
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-body-sm font-semibold transition-all cursor-pointer border shadow-xs ${
          saved
            ? "bg-primary text-on-primary border-primary hover:bg-primary/90"
            : "bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/40 hover:text-primary"
        } ${justToggled ? "scale-[1.02]" : ""} ${className}`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {saved ? "bookmark_added" : "bookmark_add"}
        </span>
        <span>{saved ? "Saved to Bookmarks" : "Save Tool"}</span>
      </button>
    );
  }

  // Default: pill variant
  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-body-sm font-medium transition-all cursor-pointer border ${
        saved
          ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 shadow-xs"
          : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface border-outline-variant/30"
      } ${justToggled ? "scale-105" : ""} ${className}`}
    >
      <span className="material-symbols-outlined text-[17px]">
        {saved ? "bookmark" : "bookmark_add"}
      </span>
      <span>{saved ? "Saved" : "Save Tool"}</span>
    </button>
  );
}
